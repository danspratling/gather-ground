/**
 * Tests for GET /api/commerce/auth/me.
 *
 * Mocks `commerce.getCustomer` and `commerce.refreshSession` and uses the
 * real `getSession` / `setSession` so we exercise the actual sealed-cookie
 * round-trip.
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
import type { APIContext } from 'astro';
import type { Customer } from '../types';

const getCustomerMock = vi.fn();
const refreshSessionMock = vi.fn();

vi.mock('@/lib/commerce', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/commerce')>();
  return {
    ...actual,
    commerce: {
      ...actual.commerce,
      getCustomer: (...args: unknown[]) => getCustomerMock(...args),
      refreshSession: (...args: unknown[]) => refreshSessionMock(...args),
    },
  };
});

import {
  SESSION_COOKIE_NAME,
  getSession,
  setSession,
  type SessionData,
} from '@/lib/commerce';
import { GET } from '@/pages/api/commerce/auth/me';
import { createMockCookies } from './authRouteTestUtils';

const sampleCustomer: Customer = {
  id: 'cust-123',
  email: 'jane@example.com',
  firstName: 'Jane',
  lastName: 'Doe',
  phone: '+44 1234 567890',
  addresses: [],
  createdAt: new Date('2026-01-01T00:00:00Z'),
  updatedAt: new Date('2026-01-01T00:00:00Z'),
};

const farFutureExpiry = Math.floor(Date.now() / 1000) + 3600;
const aboutToExpire = Math.floor(Date.now() / 1000) + 30;

beforeAll(() => {
  vi.stubEnv('SESSION_SECRET', 'a'.repeat(48));
});

beforeEach(() => {
  getCustomerMock.mockReset();
  refreshSessionMock.mockReset();
});

afterAll(() => {
  vi.unstubAllEnvs();
});

function makeCtx(): APIContext {
  const request = new Request('https://example.com/api/commerce/auth/me', {
    method: 'GET',
  });
  const { cookies } = createMockCookies();
  return {
    request,
    cookies,
    clientAddress: '203.0.113.1',
  } as unknown as APIContext;
}

describe('GET /api/commerce/auth/me', () => {
  it('returns 401 when there is no session cookie', async () => {
    const ctx = makeCtx();
    const response = await GET(ctx);

    expect(response.status).toBe(401);
    expect(getCustomerMock).not.toHaveBeenCalled();
    expect(refreshSessionMock).not.toHaveBeenCalled();
  });

  it('returns 200 + customer when the session is valid and not near expiry', async () => {
    getCustomerMock.mockResolvedValueOnce(sampleCustomer);
    const ctx = makeCtx();
    const session: SessionData = {
      customerId: 'cust-123',
      accessToken: 'cl-token-abc',
      expiresAt: farFutureExpiry,
    };
    await setSession(ctx.cookies, session);

    const response = await GET(ctx);

    expect(response.status).toBe(200);
    const json = (await response.json()) as Record<string, unknown>;
    expect(json).toEqual({
      success: true,
      customer: {
        id: 'cust-123',
        email: 'jane@example.com',
        firstName: 'Jane',
        lastName: 'Doe',
        phone: '+44 1234 567890',
      },
    });
    expect(getCustomerMock).toHaveBeenCalledWith('cl-token-abc');
    expect(refreshSessionMock).not.toHaveBeenCalled();
  });

  it('does not leak the access token in the response body', async () => {
    getCustomerMock.mockResolvedValueOnce(sampleCustomer);
    const ctx = makeCtx();
    await setSession(ctx.cookies, {
      customerId: 'cust-123',
      accessToken: 'cl-token-abc',
      expiresAt: farFutureExpiry,
    });

    const response = await GET(ctx);
    expect(await response.text()).not.toContain('cl-token-abc');
  });

  it('refreshes the token and rewrites the cookie when within the leeway', async () => {
    const refreshedToken = 'cl-token-new';
    const refreshedExpiry = Math.floor(Date.now() / 1000) + 7200;

    refreshSessionMock.mockResolvedValueOnce({
      token: refreshedToken,
      customer: sampleCustomer,
      expiresAt: refreshedExpiry,
    });
    getCustomerMock.mockResolvedValueOnce(sampleCustomer);

    const ctx = makeCtx();
    await setSession(ctx.cookies, {
      customerId: 'cust-123',
      accessToken: 'cl-token-old',
      expiresAt: aboutToExpire,
    });

    const response = await GET(ctx);
    expect(response.status).toBe(200);

    expect(refreshSessionMock).toHaveBeenCalledWith('cl-token-old');
    expect(getCustomerMock).toHaveBeenCalledWith(refreshedToken);

    const stored = await getSession(ctx.cookies);
    expect(stored?.accessToken).toBe(refreshedToken);
    expect(stored?.expiresAt).toBe(refreshedExpiry);
  });

  it('clears the cookie and returns 401 when refresh throws', async () => {
    refreshSessionMock.mockRejectedValueOnce(new Error('CL refresh 401'));
    const ctx = makeCtx();
    await setSession(ctx.cookies, {
      customerId: 'cust-123',
      accessToken: 'cl-token-expired',
      expiresAt: aboutToExpire,
    });

    const response = await GET(ctx);

    expect(response.status).toBe(401);
    expect(ctx.cookies.get(SESSION_COOKIE_NAME)).toBeUndefined();
    expect(getCustomerMock).not.toHaveBeenCalled();
  });

  it('clears the cookie and returns 401 when getCustomer throws', async () => {
    getCustomerMock.mockRejectedValueOnce(new Error('CL 401'));
    const ctx = makeCtx();
    await setSession(ctx.cookies, {
      customerId: 'cust-123',
      accessToken: 'cl-token-revoked',
      expiresAt: farFutureExpiry,
    });

    const response = await GET(ctx);

    expect(response.status).toBe(401);
    expect(ctx.cookies.get(SESSION_COOKIE_NAME)).toBeUndefined();
  });

  it('does not rewrite the cookie when no refresh happened', async () => {
    getCustomerMock.mockResolvedValueOnce(sampleCustomer);
    const ctx = makeCtx();
    await setSession(ctx.cookies, {
      customerId: 'cust-123',
      accessToken: 'cl-token-abc',
      expiresAt: farFutureExpiry,
    });
    const before = ctx.cookies.get(SESSION_COOKIE_NAME)?.value;

    await GET(ctx);
    const after = ctx.cookies.get(SESSION_COOKIE_NAME)?.value;
    expect(after).toBe(before);
  });
});
