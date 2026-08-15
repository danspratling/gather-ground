export const prerender = false;

import type { APIRoute } from 'astro';
import { commerce } from '@/lib/commerce';
import { getCartId } from '@/lib/commerce/cart/cookies';
import { jsonResponse } from '@/lib/commerce/apiHelpers';

export const POST: APIRoute = async ({ cookies }) => {
  const cartId = getCartId(cookies);
  if (!cartId) return jsonResponse(400, { error: 'No cart found' });

  try {
    const paymentMethod = await commerce.createPaymentSource(cartId, {});
    return jsonResponse(200, {
      paymentMethod: {
        id: paymentMethod.id,
        type: paymentMethod.type,
        displayName: paymentMethod.displayName,
      },
      clientSecret: paymentMethod.clientSecret,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Payment source error';
    return jsonResponse(500, { error: message });
  }
};
