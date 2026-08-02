import type { APIRoute } from 'astro';

import { hydrateSession } from '@/lib/commerce/sessionHydrate';
import {
  isNonEmptyString,
  isValidEmail,
  jsonResponse,
  parseJsonBody,
} from '@/lib/commerce/apiHelpers';
import { commerce } from '@/lib/commerce';

export const prerender = false;

export const GET: APIRoute = async ({ cookies }) => {
  const { customer, sessionExpired } = await hydrateSession(cookies);

  if (!customer) {
    return jsonResponse(401, {
      success: false,
      error: sessionExpired ? 'Session expired' : 'Not authenticated',
    });
  }

  return jsonResponse(200, {
    firstName: customer.firstName,
    lastName: customer.lastName,
    email: customer.email,
  });
};

export const PATCH: APIRoute = async ({ request, cookies }) => {
  const { session, customer, sessionExpired } = await hydrateSession(cookies);

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

  const fields: { firstName?: string; lastName?: string; email?: string } = {};
  if (isNonEmptyString(body.firstName)) fields.firstName = body.firstName;
  if (isNonEmptyString(body.lastName)) fields.lastName = body.lastName;
  if (isValidEmail(body.email)) fields.email = body.email;

  if (Object.keys(fields).length === 0) {
    return jsonResponse(400, {
      success: false,
      error: 'No valid fields provided',
    });
  }

  try {
    await commerce.updateCustomer(session.accessToken, fields);
  } catch (err) {
    console.error('Profile update failed:', err);
    return jsonResponse(500, {
      success: false,
      error: 'Failed to update profile',
    });
  }

  return jsonResponse(200, { success: true });
};
