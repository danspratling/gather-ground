/**
 * Tests for POST /api/commerce/auth/login.
 *
 * Mocks the `commerce` singleton's `login` method so the route is exercised
 * end-to-end without touching the Commerce Layer SDK. Uses the real
 * `setSession` so we also verify that a sealed session cookie is written.
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
import type { AstroCookies, APIContext } from 'astro';
import type { Customer } from '../types';

const loginMock = vi.fn();

vi.mock('@/lib/commerce', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/commerce')>();
  return {
    ...actual,
    commerce: {
      ...actual.commerce,
      login: (...args: unknown[]) => loginMock(...args),
    },
  };
});

import { SESSION_COOKIE_NAME, getSession } from '@/lib/commerce';
import { resetRateLimit } from '../rateLimit';
import { POST } from '@/pages/api/commerce/auth/login';

interface StoredCookie {
  value: string;
  options?: Record<string, unknown>;
}

function createMockCookies(): {
  cookies: AstroCookies;
  store: Map<string, StoredCookie>;
} {
  const store = new Map<string, StoredCookie>();
  const cookies = {
    get(name: string) {
      const entry = store.get(name);
      return entry ? { value: entry.value } : undefined;
    },
    set(name: string, value: string, options?: Record<string, unknown>) {
      store.set(name, { value, options });
    },
    delete(name: string) {
      store.delete(name);
    },
  } as unknown as AstroCookies;
  return { cookies, store };
}

function makeContext(body: unknown, headers: HeadersInit = {}): APIContext {
  const request = new Request('https://example.com/api/commerce/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: JSON.stringify(body),
  });
  const { cookies } = createMockCookies();
  return {
    request,
    cookies,
    clientAddress: '203.0.113.1',
  } as unknown as APIContext;
}

const sampleCustomer: Customer = {
  id: 'cust-123',
  email: 'jane@example.com',
  firstName: 'Jane',
  lastName: 'Doe',
  addresses: [],
  createdAt: new Date('2026-01-01T00:00:00Z'),
  updatedAt: new Date('2026-01-01T00:00:00Z'),
};

const sampleLoginResult = {
  token: 'cl-access-token-xyz',
  customer: sampleCustomer,
  expiresAt: Math.floor(Date.now() / 1000) + 7200,
};

beforeAll(() => {
  vi.stubEnv('SESSION_SECRET', 'a'.repeat(48));
});

beforeEach(() => {
  loginMock.mockReset();
  resetRateLimit();
});

afterAll(() => {
  vi.unstubAllEnvs();
});

describe('POST /api/commerce/auth/login', () => {
  it('returns 200 with safe customer payload and writes a session cookie', async () => {
    loginMock.mockResolvedValueOnce(sampleLoginResult);

    const ctx = makeContext({
      email: 'jane@example.com',
      password: 'hunter2hunter2',
    });
    const response = await POST(ctx);

    expect(response.status).toBe(200);
    const json = (await response.json()) as Record<string, unknown>;
    expect(json).toEqual({
      success: true,
      customer: {
        id: 'cust-123',
        email: 'jane@example.com',
        firstName: 'Jane',
        lastName: 'Doe',
      },
    });

    const stored = await getSession(ctx.cookies);
    expect(stored?.customerId).toBe('cust-123');
    expect(stored?.accessToken).toBe('cl-access-token-xyz');
    expect(stored?.expiresAt).toBe(sampleLoginResult.expiresAt);
  });

  it('does not leak the access token in the response body', async () => {
    loginMock.mockResolvedValueOnce(sampleLoginResult);

    const response = await POST(
      makeContext({ email: 'jane@example.com', password: 'hunter2hunter2' })
    );
    const text = await response.text();
    expect(text).not.toContain('cl-access-token-xyz');
  });

  it('returns 400 when the request body is not valid JSON', async () => {
    const badRequest = new Request(
      'https://example.com/api/commerce/auth/login',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: 'not-json',
      }
    );
    const { cookies } = createMockCookies();
    const response = await POST({
      request: badRequest,
      cookies,
      clientAddress: '203.0.113.2',
    } as unknown as APIContext);

    expect(response.status).toBe(400);
    expect(loginMock).not.toHaveBeenCalled();
  });

  it('returns 400 for an invalid email', async () => {
    const response = await POST(
      makeContext({ email: 'not-an-email', password: 'whatever' })
    );
    expect(response.status).toBe(400);
    expect(loginMock).not.toHaveBeenCalled();
  });

  it('returns 400 when the password is missing', async () => {
    const response = await POST(
      makeContext({ email: 'jane@example.com', password: '' })
    );
    expect(response.status).toBe(400);
    expect(loginMock).not.toHaveBeenCalled();
  });

  it('returns 401 with a generic message when the adapter rejects credentials', async () => {
    loginMock.mockRejectedValueOnce(new Error('CL: invalid credentials'));

    const response = await POST(
      makeContext({ email: 'jane@example.com', password: 'wrong-password' })
    );

    expect(response.status).toBe(401);
    const json = (await response.json()) as { error: string };
    expect(json.error).toBe('Invalid email or password');
  });

  it('does not write a session cookie when the adapter throws', async () => {
    loginMock.mockRejectedValueOnce(new Error('boom'));

    const ctx = makeContext({
      email: 'jane@example.com',
      password: 'whatever',
    });
    await POST(ctx);

    expect(ctx.cookies.get(SESSION_COOKIE_NAME)).toBeUndefined();
  });

  it('returns 429 once the per-IP rate limit is exceeded', async () => {
    loginMock.mockRejectedValue(new Error('CL: invalid credentials'));

    // 10 attempts allowed per window; the 11th must be blocked.
    for (let i = 0; i < 10; i++) {
      const r = await POST(
        makeContext({
          email: 'jane@example.com',
          password: `wrong-${i}`,
        })
      );
      expect(r.status).toBe(401);
    }

    const blocked = await POST(
      makeContext({ email: 'jane@example.com', password: 'wrong-11' })
    );
    expect(blocked.status).toBe(429);
    expect(blocked.headers.get('Retry-After')).toBeTruthy();
  });
});
