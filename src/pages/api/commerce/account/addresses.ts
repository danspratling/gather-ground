import type { APIRoute } from 'astro';
import {
  isNonEmptyString,
  jsonResponse,
  parseJsonBody,
} from '@/lib/commerce/apiHelpers';
import { commerce } from '@/lib/commerce';
import { hydrateSession } from '@/lib/commerce/sessionHydrate';

export const prerender = false;

export const GET: APIRoute = async ({ cookies }) => {
  const { customer, sessionExpired, session } = await hydrateSession(cookies);
  if (!customer || !session) {
    return jsonResponse(401, {
      success: false,
      error: sessionExpired ? 'Session expired' : 'Not authenticated',
    });
  }

  const addresses = await commerce.listAddresses(session.accessToken);
  return jsonResponse(200, { success: true, addresses });
};

export const POST: APIRoute = async ({ cookies, request }) => {
  const { customer, sessionExpired, session } = await hydrateSession(cookies);
  if (!customer || !session) {
    return jsonResponse(401, {
      success: false,
      error: sessionExpired ? 'Session expired' : 'Not authenticated',
    });
  }

  const body = await parseJsonBody(request);
  if (!body) {
    return jsonResponse(400, { success: false, error: 'Invalid request body' });
  }

  const {
    firstName,
    lastName,
    line1,
    line2,
    city,
    state,
    postalCode,
    country,
    phone,
    isDefaultShipping,
    isDefaultBilling,
  } = body;

  if (
    !isNonEmptyString(firstName) ||
    !isNonEmptyString(lastName) ||
    !isNonEmptyString(line1) ||
    !isNonEmptyString(city) ||
    !isNonEmptyString(postalCode) ||
    !isNonEmptyString(country)
  ) {
    return jsonResponse(400, {
      success: false,
      error:
        'Missing required fields: firstName, lastName, line1, city, postalCode, country',
    });
  }

  let newAddress;
  try {
    newAddress = await commerce.createAddress(session.accessToken, {
      firstName,
      lastName,
      line1,
      line2: typeof line2 === 'string' ? line2 : undefined,
      city,
      state: typeof state === 'string' ? state : undefined,
      postalCode,
      country,
      phone: typeof phone === 'string' ? phone : undefined,
    });
  } catch (err) {
    console.error('createAddress failed:', err);
    return jsonResponse(500, {
      success: false,
      error: 'Failed to save address. Please check your details and try again.',
    });
  }

  const defaultTypes: Array<'shipping' | 'billing'> = [
    ...(isDefaultShipping ? (['shipping'] as const) : []),
    ...(isDefaultBilling ? (['billing'] as const) : []),
  ];
  if (defaultTypes.length > 0 && newAddress.id) {
    try {
      await commerce.setDefaultAddress(
        session.accessToken,
        newAddress.id,
        defaultTypes.length === 1 ? defaultTypes[0] : defaultTypes
      );
    } catch (err) {
      console.error('setDefaultAddress failed:', err);
      // best-effort — address was created successfully
    }
  }

  return jsonResponse(201, { success: true, address: newAddress });
};
