import type { APIRoute } from 'astro';
import { commerce, getSession, clearSession } from '@/lib/commerce';
import { jsonResponse } from '@/lib/commerce/apiHelpers';

export const prerender = false;

export const POST: APIRoute = async ({ cookies }) => {
  const session = await getSession(cookies);

  // Clear the cookie first so the client is logged out even if the upstream
  // logout call throws. CL access tokens are stateless + short-lived; logout
  // is effectively cookie-clear plus best-effort revoke.
  clearSession(cookies);

  if (session?.accessToken) {
    try {
      await commerce.logout(session.accessToken);
    } catch (err) {
      console.error('Commerce logout failed:', err);
    }
  }

  return jsonResponse(200, { success: true });
};
