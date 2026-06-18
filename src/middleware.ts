import { defineMiddleware } from 'astro:middleware';
import { isCommerceEnabled } from '@/lib/commerce/featureFlag';

const GATED_ROUTE_PATTERNS = [
  /^\/checkout(?:\/.*)?$/,
  /^\/account(?:\/.*)?$/,
  /^\/api\/commerce(?:\/.*)?$/,
];

const isGatedPath = (pathname: string): boolean =>
  GATED_ROUTE_PATTERNS.some((pattern) => pattern.test(pathname));

export const onRequest = defineMiddleware(async (context, next) => {
  if (!isCommerceEnabled() && isGatedPath(context.url.pathname)) {
    const response = await context.rewrite('/404');
    return new Response(response.body, {
      status: 404,
      headers: response.headers,
    });
  }

  return next();
});
