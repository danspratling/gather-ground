export const prerender = false;

import type { APIRoute } from 'astro';
import { commerce } from '@/lib/commerce';
import { getCartId, clearCartId } from '@/lib/commerce/cart/cookies';
import { jsonResponse, parseJsonBody } from '@/lib/commerce/apiHelpers';

// Short-lived cookie so a guest can view their confirmation page
// without being logged in. Expires after 24 h.
const GUEST_ORDER_COOKIE = 'gg_guest_order';
const GUEST_ORDER_MAX_AGE = 24 * 60 * 60; // 24 hours in seconds

export const POST: APIRoute = async ({ cookies, request }) => {
  const cartId = getCartId(cookies);
  if (!cartId) return jsonResponse(400, { error: 'No cart found' });

  const body = await parseJsonBody(request);
  const paymentMethodId =
    typeof body?.paymentMethodId === 'string' ? body.paymentMethodId : '';

  try {
    const order = await commerce.placeOrder(cartId, paymentMethodId);

    // Clear the cart so the next visit starts fresh
    clearCartId(cookies);

    // Set a short-lived guest-order cookie so the confirmation page can
    // verify the guest has access to this order without requiring a login.
    cookies.set(GUEST_ORDER_COOKIE, order.id, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: GUEST_ORDER_MAX_AGE,
      secure: import.meta.env.PROD,
    });

    return jsonResponse(200, { order });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : 'Order placement failed';
    return jsonResponse(500, { error: message });
  }
};
