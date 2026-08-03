/**
 * POST /api/commerce/cart/items  — add a line item (creates cart if needed)
 * PATCH /api/commerce/cart/items — update line item quantity
 * DELETE /api/commerce/cart/items — remove a line item
 *
 * The cart ID is persisted in the `gg_cart` HttpOnly cookie.
 */

import type { APIRoute } from 'astro';
import { commerce } from '@/lib/commerce';
import { getCartId, setCartId } from '@/lib/commerce/cart/cookies';
import { jsonResponse, parseJsonBody } from '@/lib/commerce/apiHelpers';

export const prerender = false;

// ---------------------------------------------------------------------------
// POST — add item
// ---------------------------------------------------------------------------

export const POST: APIRoute = async ({ request, cookies }) => {
  const body = await parseJsonBody(request);
  if (!body) {
    return jsonResponse(400, { success: false, error: 'Invalid request body' });
  }

  const { skuCode, quantity } = body;
  if (typeof skuCode !== 'string' || skuCode.trim().length === 0) {
    return jsonResponse(400, { success: false, error: 'skuCode is required' });
  }
  if (typeof quantity !== 'number' || quantity < 1) {
    return jsonResponse(400, {
      success: false,
      error: 'quantity must be a positive number',
    });
  }

  let cartId = getCartId(cookies);

  try {
    if (!cartId) {
      const newCart = await commerce.createCart();
      cartId = newCart.id;
      setCartId(cookies, cartId);
    }

    await commerce.addLineItem(cartId, skuCode, quantity);
    const cart = await commerce.getCart(cartId);
    return jsonResponse(201, cart as unknown as Record<string, unknown>);
  } catch (err) {
    console.error('POST /api/commerce/cart/items error:', err);
    return jsonResponse(500, { success: false, error: 'Failed to add item' });
  }
};

// ---------------------------------------------------------------------------
// PATCH — update item quantity
// ---------------------------------------------------------------------------

export const PATCH: APIRoute = async ({ request, cookies }) => {
  const cartId = getCartId(cookies);
  if (!cartId) {
    return jsonResponse(400, { success: false, error: 'No active cart' });
  }

  const body = await parseJsonBody(request);
  if (!body) {
    return jsonResponse(400, { success: false, error: 'Invalid request body' });
  }

  const { lineItemId, quantity } = body;
  if (typeof lineItemId !== 'string' || lineItemId.trim().length === 0) {
    return jsonResponse(400, {
      success: false,
      error: 'lineItemId is required',
    });
  }
  if (typeof quantity !== 'number' || quantity < 1) {
    return jsonResponse(400, {
      success: false,
      error: 'quantity must be a positive number',
    });
  }

  try {
    await commerce.updateLineItem(cartId, lineItemId, quantity);
    const cart = await commerce.getCart(cartId);
    return jsonResponse(200, cart as unknown as Record<string, unknown>);
  } catch (err) {
    console.error('PATCH /api/commerce/cart/items error:', err);
    return jsonResponse(500, {
      success: false,
      error: 'Failed to update item',
    });
  }
};

// ---------------------------------------------------------------------------
// DELETE — remove item
// ---------------------------------------------------------------------------

export const DELETE: APIRoute = async ({ request, cookies }) => {
  const cartId = getCartId(cookies);
  if (!cartId) {
    return jsonResponse(400, { success: false, error: 'No active cart' });
  }

  const body = await parseJsonBody(request);
  if (!body) {
    return jsonResponse(400, { success: false, error: 'Invalid request body' });
  }

  const { lineItemId } = body;
  if (typeof lineItemId !== 'string' || lineItemId.trim().length === 0) {
    return jsonResponse(400, {
      success: false,
      error: 'lineItemId is required',
    });
  }

  try {
    await commerce.removeLineItem(cartId, lineItemId);
    const cart = await commerce.getCart(cartId);
    return jsonResponse(200, cart as unknown as Record<string, unknown>);
  } catch (err) {
    console.error('DELETE /api/commerce/cart/items error:', err);
    return jsonResponse(500, {
      success: false,
      error: 'Failed to remove item',
    });
  }
};
