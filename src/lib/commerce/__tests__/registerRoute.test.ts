/**
 * Tests for POST /api/commerce/auth/register.
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
import type { Customer } from '../types';

const registerMock = vi.fn();

vi.mock('@/lib/commerce', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/commerce')>();
  return {
    ...actual,
    commerce: {
      ...actual.commerce,
      register: (...args: unknown[]) => registerMock(...args),
    },
  };
});

import { SESSION_COOKIE_NAME, getSession } from '@/lib/commerce';
import { resetRateLimit } from '../rateLimit';
import { POST } from '@/pages/api/commerce/auth/register';
import { makeJsonContext } from './authRouteTestUtils';

const sampleCustomer: Customer = {
  id: 'cust-new',
  email: 'new@example.com',
  firstName: 'New',
  lastName: 'User',
  addresses: [],
  createdAt: new Date('2026-01-01T00:00:00Z'),
  updatedAt: new Date('2026-01-01T00:00:00Z'),
};

const sampleRegisterResult = {
  token: 'cl-new-token',
  customer: sampleCustomer,
  expiresAt: Math.floor(Date.now() / 1000) + 7200,
};

beforeAll(() => {
  vi.stubEnv('SESSION_SECRET', 'a'.repeat(48));
});

beforeEach(() => {
  registerMock.mockReset();
  resetRateLimit();
});

afterAll(() => {
  vi.unstubAllEnvs();
});

const url = 'https://example.com/api/commerce/auth/register';

const validBody = {
  email: 'new@example.com',
  password: 'longenough1',
  firstName: 'New',
  lastName: 'User',
};

describe('POST /api/commerce/auth/register', () => {
  it('returns 201, writes a session, and returns the safe customer payload', async () => {
    registerMock.mockResolvedValueOnce(sampleRegisterResult);

    const ctx = makeJsonContext(url, validBody);
    const response = await POST(ctx);

    expect(response.status).toBe(201);
    const json = (await response.json()) as Record<string, unknown>;
    expect(json).toEqual({
      success: true,
      customer: {
        id: 'cust-new',
        email: 'new@example.com',
        firstName: 'New',
        lastName: 'User',
      },
    });

    const stored = await getSession(ctx.cookies);
    expect(stored?.customerId).toBe('cust-new');
    expect(stored?.accessToken).toBe('cl-new-token');
  });

  it('returns 400 on an invalid email', async () => {
    const response = await POST(
      makeJsonContext(url, { ...validBody, email: 'nope' })
    );
    expect(response.status).toBe(400);
    expect(registerMock).not.toHaveBeenCalled();
  });

  it('returns 400 on a too-short password', async () => {
    const response = await POST(
      makeJsonContext(url, { ...validBody, password: 'short' })
    );
    expect(response.status).toBe(400);
    expect(registerMock).not.toHaveBeenCalled();
  });

  it('returns 400 when first or last name is missing', async () => {
    const response = await POST(
      makeJsonContext(url, { ...validBody, firstName: '   ' })
    );
    expect(response.status).toBe(400);
    expect(registerMock).not.toHaveBeenCalled();
  });

  it('returns 409 generic error when the adapter rejects (no account enumeration)', async () => {
    registerMock.mockRejectedValueOnce(new Error('email already taken'));

    const response = await POST(makeJsonContext(url, validBody));

    expect(response.status).toBe(409);
    const json = (await response.json()) as { error: string };
    expect(json.error).toBe('Could not create account');
    expect(json.error.toLowerCase()).not.toContain('already');
  });

  it('does not write a session when register throws', async () => {
    registerMock.mockRejectedValueOnce(new Error('boom'));
    const ctx = makeJsonContext(url, validBody);
    await POST(ctx);
    expect(ctx.cookies.get(SESSION_COOKIE_NAME)).toBeUndefined();
  });

  it('returns 429 after the rate limit is exceeded', async () => {
    registerMock.mockResolvedValue(sampleRegisterResult);

    for (let i = 0; i < 5; i++) {
      const r = await POST(makeJsonContext(url, validBody));
      expect(r.status).toBe(201);
    }
    const blocked = await POST(makeJsonContext(url, validBody));
    expect(blocked.status).toBe(429);
    expect(blocked.headers.get('Retry-After')).toBeTruthy();
  });
});
