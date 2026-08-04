/**
 * GET /api/commerce/cart — read the current cart
 *
 * - Reads the `gg_cart` HttpOnly cookie
 * - If no cart ID: create a new empty cart, set the cookie, return it
 * - If cart ID exists: fetch cart from the commerce provider and return it
 * - If the stored cart is not found / expired: create a fresh one
 *
 * Returns: { id, items, subtotal, total, count }
 */

import type { APIRoute } from 'astro';
import { commerce } from '@/lib/commerce';
import { getCartId, setCartId } from '@/lib/commerce/cart/cookies';
import { jsonResponse } from '@/lib/commerce/apiHelpers';
import type { Cart } from '@/lib/commerce/types';

export const prerender = false;

// ---------------------------------------------------------------------------
// Helper
// ---------------------------------------------------------------------------

function mapCartResponse(cart: Cart): Record<string, unknown> {
  const count = cart.lineItems.reduce((sum, item) => sum + item.quantity, 0);
  return {
    id: cart.id,
    items: cart.lineItems,
    subtotal: cart.subtotal,
    total: cart.total,
    count,
  };
}

// ---------------------------------------------------------------------------
// GET
// ---------------------------------------------------------------------------

export const GET: APIRoute = async ({ cookies }) => {
  let cartId = getCartId(cookies);

  if (!cartId) {
    const cart = await commerce.createCart();
    setCartId(cookies, cart.id);
    return jsonResponse(200, mapCartResponse(cart));
  }

  try {
    const cart = await commerce.getCart(cartId);
    return jsonResponse(200, mapCartResponse(cart));
  } catch {
    // Cart not found or expired — create a new one
    const cart = await commerce.createCart();
    setCartId(cookies, cart.id);
    return jsonResponse(200, mapCartResponse(cart));
  }
};
