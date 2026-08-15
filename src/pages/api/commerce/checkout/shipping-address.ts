/**
 * POST /api/commerce/checkout/shipping-address — set shipping (and optionally billing) address
 *
 * Body: { shipping: Address, billing?: Address, billingSameAsShipping?: boolean }
 * Returns: { success: true }
 */

import type { APIRoute } from 'astro';
import type { Address } from '@/lib/commerce/types';
import { commerce } from '@/lib/commerce';
import { getCartId } from '@/lib/commerce/cart/cookies';
import { jsonResponse, parseJsonBody } from '@/lib/commerce/apiHelpers';

export const prerender = false;

function isValidAddress(value: unknown): value is Address {
  if (!value || typeof value !== 'object') return false;
  const a = value as Record<string, unknown>;
  return (
    typeof a.firstName === 'string' &&
    a.firstName.trim().length > 0 &&
    typeof a.lastName === 'string' &&
    a.lastName.trim().length > 0 &&
    typeof a.line1 === 'string' &&
    a.line1.trim().length > 0 &&
    typeof a.city === 'string' &&
    a.city.trim().length > 0 &&
    typeof a.postalCode === 'string' &&
    a.postalCode.trim().length > 0 &&
    typeof a.country === 'string' &&
    a.country.trim().length > 0
  );
}

export const POST: APIRoute = async ({ request, cookies }) => {
  const cartId = getCartId(cookies);
  if (!cartId) {
    return jsonResponse(400, { error: 'No cart found' });
  }

  const body = await parseJsonBody(request);
  if (!body) {
    return jsonResponse(400, { error: 'Invalid request body' });
  }

  const { shipping, billing, billingSameAsShipping } = body;

  if (!isValidAddress(shipping)) {
    return jsonResponse(400, {
      error:
        'shipping address is required with firstName, lastName, line1, city, postalCode, and country',
    });
  }

  try {
    await commerce.setShippingAddress(cartId, shipping);

    if (billingSameAsShipping || !billing) {
      await commerce.setBillingAddress(cartId, shipping);
    } else {
      if (!isValidAddress(billing)) {
        return jsonResponse(400, {
          error:
            'billing address must include firstName, lastName, line1, city, postalCode, and country',
        });
      }
      await commerce.setBillingAddress(cartId, billing);
    }

    return jsonResponse(200, { success: true });
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Internal error';
    return jsonResponse(500, { error });
  }
};
