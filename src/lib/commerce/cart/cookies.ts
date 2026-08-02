/**
 * Cart cookie helpers
 *
 * Read/write the `gg_cart` cookie that persists the guest cart ID across
 * requests. The cookie is HttpOnly so it is not accessible from client-side
 * JavaScript.
 */

import type { AstroCookies } from 'astro';

const CART_COOKIE_NAME = 'gg_cart';
const MAX_AGE = 30 * 24 * 60 * 60; // 30 days in seconds

function cookieOptions() {
  return {
    httpOnly: true,
    sameSite: 'lax' as const,
    path: '/',
    maxAge: MAX_AGE,
    secure: import.meta.env.PROD,
  };
}

/**
 * Read the current guest cart ID from cookies.
 * Returns `undefined` when no cart cookie is present.
 */
export function getCartId(cookies: AstroCookies): string | undefined {
  return cookies.get(CART_COOKIE_NAME)?.value;
}

/**
 * Persist a cart ID in the `gg_cart` cookie.
 */
export function setCartId(cookies: AstroCookies, id: string): void {
  cookies.set(CART_COOKIE_NAME, id, cookieOptions());
}

/**
 * Remove the `gg_cart` cookie (e.g. after order placement or session merge).
 */
export function clearCartId(cookies: AstroCookies): void {
  cookies.delete(CART_COOKIE_NAME);
}

export default null;
