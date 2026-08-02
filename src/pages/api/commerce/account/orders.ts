import type { APIRoute } from 'astro';
import { hydrateSession } from '@/lib/commerce/sessionHydrate';
import { jsonResponse } from '@/lib/commerce/apiHelpers';
import { listOrders } from '@/lib/commerce';

export const prerender = false;

/**
 * GET /api/commerce/account/orders?page=N
 *
 * Returns the authenticated customer's paginated order list.
 * 401 when no valid session is present.
 */
export const GET: APIRoute = async ({ cookies, url }) => {
  const { session, sessionExpired } = await hydrateSession(cookies);
  if (!session) {
    return jsonResponse(401, {
      success: false,
      error: sessionExpired ? 'Session expired' : 'Not authenticated',
    });
  }

  const pageParam = url.searchParams.get('page');
  const page = pageParam ? Math.max(1, parseInt(pageParam, 10)) : 1;

  try {
    const result = await listOrders(session.accessToken, page);
    return jsonResponse(200, { success: true, ...result });
  } catch (err) {
    console.error('Failed to list orders:', err);
    return jsonResponse(500, {
      success: false,
      error: 'Failed to fetch orders',
    });
  }
};
