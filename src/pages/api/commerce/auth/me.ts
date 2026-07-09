import type { APIRoute } from 'astro';
import {
  clearSession,
  commerce,
  getSession,
  setSession,
  type SessionData,
} from '@/lib/commerce';
import { jsonResponse } from '@/lib/commerce/apiHelpers';

export const prerender = false;

/**
 * Margin in seconds before `session.expiresAt` at which we proactively refresh
 * the CL access token. Avoids the next request landing on a stale token.
 */
const REFRESH_LEEWAY_SECONDS = 60;

export const GET: APIRoute = async ({ cookies }) => {
  const session = await getSession(cookies);
  if (!session) {
    return jsonResponse(401, { success: false, error: 'Not authenticated' });
  }

  const nowSeconds = Math.floor(Date.now() / 1000);
  const needsRefresh = session.expiresAt - nowSeconds < REFRESH_LEEWAY_SECONDS;

  let token = session.accessToken;
  let expiresAt = session.expiresAt;
  let refreshed = false;

  if (needsRefresh) {
    try {
      const result = await commerce.refreshSession(session.accessToken);
      token = result.token;
      expiresAt = result.expiresAt;
      refreshed = true;
    } catch (err) {
      console.error('Commerce refreshSession failed:', err);
      clearSession(cookies);
      return jsonResponse(401, { success: false, error: 'Session expired' });
    }
  }

  let customer: Awaited<ReturnType<typeof commerce.getCustomer>>;
  try {
    customer = await commerce.getCustomer(token);
  } catch (err) {
    console.error('Commerce getCustomer failed:', err);
    clearSession(cookies);
    return jsonResponse(401, { success: false, error: 'Session expired' });
  }

  if (refreshed) {
    const next: SessionData = {
      customerId: customer.id,
      accessToken: token,
      expiresAt,
      ...(session.refreshToken ? { refreshToken: session.refreshToken } : {}),
    };
    await setSession(cookies, next);
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
