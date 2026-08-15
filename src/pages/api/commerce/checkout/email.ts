/**
 * POST /api/commerce/checkout/email — set guest email on the order
 *
 * Body: { email: string }
 * Returns: { success: true }
 */

import type { APIRoute } from 'astro';
import { commerce } from '@/lib/commerce';
import { getCartId } from '@/lib/commerce/cart/cookies';
import {
  jsonResponse,
  parseJsonBody,
  isValidEmail,
} from '@/lib/commerce/apiHelpers';

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

  const { email } = body;
  if (!isValidEmail(email)) {
    return jsonResponse(400, { error: 'A valid email address is required' });
  }

  try {
    await commerce.setOrderEmail(cartId, email);
    return jsonResponse(200, { success: true });
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Internal error';
    return jsonResponse(500, { error });
  }
};
