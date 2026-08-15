/**
 * GET /api/commerce/checkout/shipping-methods — list available shipping methods
 *
 * Returns: { shippingMethods: ShippingMethod[] }
 */

import type { APIRoute } from 'astro';
import { commerce } from '@/lib/commerce';
import { getCartId } from '@/lib/commerce/cart/cookies';
import { jsonResponse } from '@/lib/commerce/apiHelpers';

export const prerender = false;

export const GET: APIRoute = async ({ cookies }) => {
  const cartId = getCartId(cookies);
  if (!cartId) {
    return jsonResponse(400, { error: 'No cart found' });
  }

  try {
    const shippingMethods = await commerce.listShippingMethods(cartId);
    return jsonResponse(200, {
      shippingMethods: shippingMethods as unknown as Record<string, unknown>[],
    });
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Internal error';
    return jsonResponse(500, { error });
  }
};
