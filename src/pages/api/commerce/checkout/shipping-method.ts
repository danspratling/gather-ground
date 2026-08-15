/**
 * POST /api/commerce/checkout/shipping-method — select a shipping method
 *
 * Body: { shippingMethodId: string }
 * Returns: { success: true }
 */

import type { APIRoute } from 'astro';
import { commerce } from '@/lib/commerce';
import { getCartId } from '@/lib/commerce/cart/cookies';
import { jsonResponse, parseJsonBody } from '@/lib/commerce/apiHelpers';

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies }) => {
  const cartId = getCartId(cookies);
  if (!cartId) {
    return jsonResponse(400, { error: 'No cart found' });
  }

  const body = await parseJsonBody(request);
  if (!body) {
    return jsonResponse(400, { error: 'Invalid request body' });
  }

  const { shippingMethodId } = body;
  if (
    typeof shippingMethodId !== 'string' ||
    shippingMethodId.trim().length === 0
  ) {
    return jsonResponse(400, { error: 'shippingMethodId is required' });
  }

  try {
    await commerce.setShippingMethod(cartId, shippingMethodId);
    return jsonResponse(200, { success: true });
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Internal error';
    return jsonResponse(500, { error });
  }
};
