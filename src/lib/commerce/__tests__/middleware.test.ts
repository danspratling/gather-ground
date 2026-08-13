/**
 * Tests for the Astro middleware.
 *
 * Covers three responsibilities:
 *  - feature-flag gating for commerce routes (existing behaviour)
 *  - hydrating `locals.session` / `locals.customer` from the sealed cookie
 *  - redirecting unauthenticated visitors away from protected `/account/*` pages
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

const isCommerceEnabledMock = vi.fn();
const getCustomerMock = vi.fn();
const refreshSessionMock = vi.fn();

vi.mock('@/lib/commerce/featureFlag', () => ({
  isCommerceEnabled: () => isCommerceEnabledMock(),
}));

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
import { onRequest } from '@/middleware';
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
  isCommerceEnabledMock.mockReset();
  isCommerceEnabledMock.mockReturnValue(true);
  getCustomerMock.mockReset();
  refreshSessionMock.mockReset();
});

afterAll(() => {
  vi.unstubAllEnvs();
});

interface CtxOverrides {
  url?: string;
  cookies?: ReturnType<typeof createMockCookies>['cookies'];
}

function makeCtx({ url = 'https://example.com/', cookies }: CtxOverrides = {}) {
  const resolved = cookies ?? createMockCookies().cookies;
  const locals: Record<string, unknown> = {};
  const redirect = vi.fn(
    (location: string, status = 302) =>
      new Response(null, { status, headers: { Location: location } })
  );
  const rewrite = vi.fn(async () => new Response('not found', { status: 404 }));
  const ctx = {
    url: new URL(url),
    cookies: resolved,
    locals,
    redirect,
    rewrite,
  } as unknown as APIContext;
  return { ctx, redirect, rewrite, locals };
}

const passthrough = vi.fn(async () => new Response('ok', { status: 200 }));

const run = async (ctx: APIContext): Promise<Response> => {
  const result = await onRequest(ctx, passthrough);
  if (!(result instanceof Response)) {
    throw new Error('middleware returned void — expected Response');
  }
  return result;
};

describe('middleware — feature flag gating', () => {
  it('returns 404 for /account when commerce is disabled', async () => {
    isCommerceEnabledMock.mockReturnValue(false);
    const { ctx, rewrite } = makeCtx({ url: 'https://example.com/account' });

    const response = await run(ctx);

    expect(response.status).toBe(404);
    expect(rewrite).toHaveBeenCalledWith('/404');
    expect(passthrough).not.toHaveBeenCalled();
  });

  it('returns 404 for /products when commerce is disabled', async () => {
    isCommerceEnabledMock.mockReturnValue(false);
    const { ctx, rewrite } = makeCtx({ url: 'https://example.com/products' });

    const response = await run(ctx);

    expect(response.status).toBe(404);
    expect(rewrite).toHaveBeenCalledWith('/404');
    expect(passthrough).not.toHaveBeenCalled();
  });

  it('returns 404 for /products/[slug] when commerce is disabled', async () => {
    isCommerceEnabledMock.mockReturnValue(false);
    const { ctx, rewrite } = makeCtx({
      url: 'https://example.com/products/beef',
    });

    const response = await run(ctx);

    expect(response.status).toBe(404);
    expect(rewrite).toHaveBeenCalledWith('/404');
    expect(passthrough).not.toHaveBeenCalled();
  });

  it('passes through non-gated routes when commerce is disabled and sets locals to null', async () => {
    isCommerceEnabledMock.mockReturnValue(false);
    passthrough.mockClear();
    const { ctx, locals } = makeCtx({ url: 'https://example.com/about' });

    const response = await run(ctx);

    expect(response.status).toBe(200);
    expect(locals.session).toBeNull();
    expect(locals.customer).toBeNull();
    expect(passthrough).toHaveBeenCalled();
  });
});

describe('middleware — session hydration', () => {
  it('attaches null session and customer when no cookie is present', async () => {
    passthrough.mockClear();
    const { ctx, locals } = makeCtx();

    await onRequest(ctx, passthrough);

    expect(locals.session).toBeNull();
    expect(locals.customer).toBeNull();
    expect(getCustomerMock).not.toHaveBeenCalled();
    expect(passthrough).toHaveBeenCalled();
  });

  it('attaches session and customer when the cookie is valid', async () => {
    getCustomerMock.mockResolvedValueOnce(sampleCustomer);
    const { cookies } = createMockCookies();
    await setSession(cookies, {
      customerId: 'cust-123',
      accessToken: 'cl-token-abc',
      expiresAt: farFutureExpiry,
    });
    const { ctx, locals } = makeCtx({ cookies });

    await onRequest(ctx, passthrough);

    expect(getCustomerMock).toHaveBeenCalledWith('cl-token-abc');
    expect(refreshSessionMock).not.toHaveBeenCalled();
    expect(locals.customer).toEqual(sampleCustomer);
    expect((locals.session as SessionData).accessToken).toBe('cl-token-abc');
  });

  it('refreshes the token and rewrites the cookie when within the leeway', async () => {
    const refreshedToken = 'cl-token-new';
    const refreshedExpiry = Math.floor(Date.now() / 1000) + 7200;
    refreshSessionMock.mockResolvedValueOnce({
      token: refreshedToken,
      customer: sampleCustomer,
      expiresAt: refreshedExpiry,
    });

    const { cookies } = createMockCookies();
    await setSession(cookies, {
      customerId: 'cust-123',
      accessToken: 'cl-token-old',
      expiresAt: aboutToExpire,
    });
    const { ctx, locals } = makeCtx({ cookies });

    await onRequest(ctx, passthrough);

    expect(refreshSessionMock).toHaveBeenCalledWith('cl-token-old');
    // refreshSession returns the customer, so getCustomer must not be called
    // again — that would be a redundant CL request.
    expect(getCustomerMock).not.toHaveBeenCalled();
    expect((locals.session as SessionData).accessToken).toBe(refreshedToken);
    expect((locals.session as SessionData).expiresAt).toBe(refreshedExpiry);
    const stored = await getSession(cookies);
    expect(stored?.accessToken).toBe(refreshedToken);
  });

  it('clears the cookie and nulls locals when refresh fails', async () => {
    refreshSessionMock.mockRejectedValueOnce(new Error('refresh 401'));
    const { cookies } = createMockCookies();
    await setSession(cookies, {
      customerId: 'cust-123',
      accessToken: 'cl-token-old',
      expiresAt: aboutToExpire,
    });
    const { ctx, locals } = makeCtx({ cookies });

    await onRequest(ctx, passthrough);

    expect(locals.session).toBeNull();
    expect(locals.customer).toBeNull();
    expect(cookies.get(SESSION_COOKIE_NAME)).toBeUndefined();
  });
});

describe('middleware — /account route guard', () => {
  it('redirects to /account/login with next param when unauthenticated on /account', async () => {
    const { ctx, redirect } = makeCtx({
      url: 'https://example.com/account?tab=orders',
    });

    const response = await run(ctx);

    expect(response.status).toBe(302);
    expect(redirect).toHaveBeenCalledWith(
      '/account/login?next=' + encodeURIComponent('/account?tab=orders'),
      302
    );
  });

  it('does not redirect an unauthenticated visitor away from /account/login', async () => {
    passthrough.mockClear();
    const { ctx, redirect } = makeCtx({
      url: 'https://example.com/account/login',
    });

    const response = await run(ctx);

    expect(response.status).toBe(200);
    expect(redirect).not.toHaveBeenCalled();
    expect(passthrough).toHaveBeenCalled();
  });

  it('does not redirect an authenticated visitor from /account', async () => {
    getCustomerMock.mockResolvedValueOnce(sampleCustomer);
    passthrough.mockClear();
    const { cookies } = createMockCookies();
    await setSession(cookies, {
      customerId: 'cust-123',
      accessToken: 'cl-token-abc',
      expiresAt: farFutureExpiry,
    });
    const { ctx, redirect } = makeCtx({
      url: 'https://example.com/account',
      cookies,
    });

    const response = await run(ctx);

    expect(response.status).toBe(200);
    expect(redirect).not.toHaveBeenCalled();
    expect(passthrough).toHaveBeenCalled();
  });

  it('does not redirect paths that only look like /account (e.g. /accounting)', async () => {
    passthrough.mockClear();
    const { ctx, redirect } = makeCtx({
      url: 'https://example.com/accounting',
    });

    const response = await run(ctx);

    expect(response.status).toBe(200);
    expect(redirect).not.toHaveBeenCalled();
    expect(passthrough).toHaveBeenCalled();
  });
});
