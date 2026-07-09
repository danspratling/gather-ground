import type { APIRoute } from 'astro';
import { jsonResponse } from '@/lib/commerce/apiHelpers';
import { hydrateSession } from '@/lib/commerce/sessionHydrate';

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
    success: true,
    customer: {
      id: customer.id,
      email: customer.email,
      firstName: customer.firstName,
      lastName: customer.lastName,
      phone: customer.phone,
    },
  });
};
