import { defineMiddleware } from 'astro:middleware';
import { isCommerceEnabled } from '@/lib/commerce/featureFlag';
import { hydrateSession } from '@/lib/commerce/sessionHydrate';

const GATED_ROUTE_PATTERNS = [
  /^\/checkout(?:\/.*)?$/,
  /^\/account(?:\/.*)?$/,
  /^\/api\/commerce(?:\/.*)?$/,
];

const isGatedPath = (pathname: string): boolean =>
  GATED_ROUTE_PATTERNS.some((pattern) => pattern.test(pathname));

// Account routes that must remain reachable without a session so a logged-out
// visitor can actually log in / register / reset a password.
const ACCOUNT_PUBLIC_PATHS = new Set([
  '/account/login',
  '/account/register',
  '/account/forgot-password',
  '/account/reset-password',
]);

const isProtectedAccountPath = (pathname: string): boolean => {
  // Match `/account` exactly or `/account/...`, not `/accounting` etc.
  if (pathname !== '/account' && !pathname.startsWith('/account/')) {
    return false;
  }
  if (ACCOUNT_PUBLIC_PATHS.has(pathname)) return false;
  return true;
};

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;

  if (!isCommerceEnabled()) {
    if (isGatedPath(pathname)) {
      const response = await context.rewrite('/404');
      return new Response(response.body, {
        status: 404,
        headers: response.headers,
      });
    }
    context.locals.session = null;
    context.locals.customer = null;
    return next();
  }

  const { session, customer } = await hydrateSession(context.cookies);
  context.locals.session = session;
  context.locals.customer = customer;

  if (!session && isProtectedAccountPath(pathname)) {
    const nextUrl = `${pathname}${context.url.search}`;
    return context.redirect(
      `/account/login?next=${encodeURIComponent(nextUrl)}`,
      302
    );
  }

  return next();
});
