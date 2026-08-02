/**
 * Tests for POST /api/commerce/auth/logout.
 *
 * Verifies the cookie is cleared even when the upstream adapter throws.
 */

import {
  describe,
  it,
  expect,
  beforeAll,
  beforeEach,
  afterAll,
  vi,
} from 'vitest';

const logoutMock = vi.fn();

vi.mock('@/lib/commerce', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/commerce')>();
  return {
    ...actual,
    commerce: {
      ...actual.commerce,
      logout: (...args: unknown[]) => logoutMock(...args),
    },
  };
});

import {
  SESSION_COOKIE_NAME,
  getSession,
  setSession,
  type SessionData,
} from '@/lib/commerce';
import { POST } from '@/pages/api/commerce/auth/logout';
import { createMockCookies } from './authRouteTestUtils';
import type { APIContext } from 'astro';

const sessionFixture: SessionData = {
  customerId: 'cust-1',
  accessToken: 'cl-token-123',
  expiresAt: Math.floor(Date.now() / 1000) + 3600,
};

beforeAll(() => {
  vi.stubEnv('SESSION_SECRET', 'a'.repeat(48));
});

beforeEach(() => {
  logoutMock.mockReset();
});

afterAll(() => {
  vi.unstubAllEnvs();
});

function makeCtx(): APIContext {
  const request = new Request('https://example.com/api/commerce/auth/logout', {
    method: 'POST',
  });
  const { cookies } = createMockCookies();
  return {
    request,
    cookies,
    clientAddress: '203.0.113.1',
  } as unknown as APIContext;
}

describe('POST /api/commerce/auth/logout', () => {
  it('clears the session cookie and calls the adapter when a session exists', async () => {
    logoutMock.mockResolvedValueOnce(undefined);
    const ctx = makeCtx();
    await setSession(ctx.cookies, sessionFixture);

    const response = await POST(ctx);

    expect(response.status).toBe(302);
    expect(response.headers.get('Location')).toBe('/');
    expect(ctx.cookies.get(SESSION_COOKIE_NAME)).toBeUndefined();
    expect(logoutMock).toHaveBeenCalledTimes(1);
    expect(logoutMock).toHaveBeenCalledWith(sessionFixture.accessToken);
  });

  it('redirects to homepage and clears cookie even when there is no session', async () => {
    const ctx = makeCtx();
    const response = await POST(ctx);

    expect(response.status).toBe(302);
    expect(response.headers.get('Location')).toBe('/');
    expect(logoutMock).not.toHaveBeenCalled();
    expect(await getSession(ctx.cookies)).toBeNull();
  });

  it('still clears the cookie when the adapter throws', async () => {
    logoutMock.mockRejectedValueOnce(new Error('CL logout boom'));
    const ctx = makeCtx();
    await setSession(ctx.cookies, sessionFixture);

    const response = await POST(ctx);

    expect(response.status).toBe(302);
    expect(response.headers.get('Location')).toBe('/');
    expect(ctx.cookies.get(SESSION_COOKIE_NAME)).toBeUndefined();
  });
});
