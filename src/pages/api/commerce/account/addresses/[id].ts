import type { APIRoute } from 'astro';
import { jsonResponse, parseJsonBody } from '@/lib/commerce/apiHelpers';
import { commerce } from '@/lib/commerce';
import { hydrateSession } from '@/lib/commerce/sessionHydrate';

export const prerender = false;

export const PATCH: APIRoute = async ({ cookies, request, params }) => {
  const { customer, sessionExpired, session } = await hydrateSession(cookies);
  if (!customer || !session) {
    return jsonResponse(401, {
      success: false,
      error: sessionExpired ? 'Session expired' : 'Not authenticated',
    });
  }

  const addressId = params.id;
  if (!addressId) {
    return jsonResponse(400, { success: false, error: 'Address ID required' });
  }

  // Verify ownership — the address must belong to this customer.
  const ownedIds = customer.addresses.map((a) => a.id);
  if (!ownedIds.includes(addressId)) {
    return jsonResponse(403, {
      success: false,
      error: 'Address does not belong to authenticated customer',
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

  const updates: Record<string, string | undefined> = {};
  if (typeof firstName === 'string') updates.firstName = firstName;
  if (typeof lastName === 'string') updates.lastName = lastName;
  if (typeof line1 === 'string') updates.line1 = line1;
  if (typeof line2 === 'string') updates.line2 = line2;
  if (typeof city === 'string') updates.city = city;
  if (typeof state === 'string') updates.state = state;
  if (typeof postalCode === 'string') updates.postalCode = postalCode;
  if (typeof country === 'string') updates.country = country;
  if (typeof phone === 'string') updates.phone = phone;

  const updatedAddress = await commerce.updateAddress(
    session.accessToken,
    addressId,
    updates
  );

  const defaultTypes: Array<'shipping' | 'billing'> = [
    ...(isDefaultShipping ? (['shipping'] as const) : []),
    ...(isDefaultBilling ? (['billing'] as const) : []),
  ];
  if (defaultTypes.length > 0) {
    try {
      await commerce.setDefaultAddress(
        session.accessToken,
        addressId,
        defaultTypes.length === 1 ? defaultTypes[0] : defaultTypes
      );
    } catch (err) {
      console.error('setDefaultAddress failed:', err);
    }
  }

  return jsonResponse(200, { success: true, address: updatedAddress });
};

export const DELETE: APIRoute = async ({ cookies, params }) => {
  const { customer, sessionExpired, session } = await hydrateSession(cookies);
  if (!customer || !session) {
    return jsonResponse(401, {
      success: false,
      error: sessionExpired ? 'Session expired' : 'Not authenticated',
    });
  }

  const addressId = params.id;
  if (!addressId) {
    return jsonResponse(400, { success: false, error: 'Address ID required' });
  }

  // Verify ownership.
  const ownedIds = customer.addresses.map((a) => a.id);
  if (!ownedIds.includes(addressId)) {
    return jsonResponse(403, {
      success: false,
      error: 'Address does not belong to authenticated customer',
    });
  }

  await commerce.deleteAddress(session.accessToken, addressId);
  return jsonResponse(200, { success: true });
};
