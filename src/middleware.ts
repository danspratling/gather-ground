import { defineMiddleware } from 'astro:middleware';
import { isCommerceEnabled } from '@/lib/commerce/featureFlag';

const GATED_ROUTE_PATTERNS = [
  /^\/checkout(?:\/.*)?$/,
  /^\/account(?:\/.*)?$/,
  /^\/api\/commerce(?:\/.*)?$/,
];

const isGatedPath = (pathname: string): boolean =>
  GATED_ROUTE_PATTERNS.some((pattern) => pattern.test(pathname));

export const onRequest = defineMiddleware((context, next) => {
  if (!isCommerceEnabled() && isGatedPath(context.url.pathname)) {
    return new Response(null, { status: 404 });
  }

  return next();
});
