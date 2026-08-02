import type { APIRoute } from 'astro';
import { hydrateSession } from '@/lib/commerce/sessionHydrate';
import { jsonResponse } from '@/lib/commerce/apiHelpers';
import { getOrder } from '@/lib/commerce/commercelayer/customer';

export const prerender = false;

/**
 * GET /api/commerce/account/orders/[id]
 *
 * Returns a single order's detail for the authenticated customer.
 * 401 when unauthenticated, 404 when order not found or not owned by the
 * current customer.
 */
export const GET: APIRoute = async ({ cookies, params }) => {
  const { session, sessionExpired } = await hydrateSession(cookies);
  if (!session) {
    return jsonResponse(401, {
      success: false,
      error: sessionExpired ? 'Session expired' : 'Not authenticated',
    });
  }

  const orderId = params.id;
  if (!orderId) {
    return jsonResponse(400, { success: false, error: 'Order ID is required' });
  }

  try {
    const order = await getOrder(session.accessToken, orderId);
    if (!order) {
      return jsonResponse(404, { success: false, error: 'Order not found' });
    }
    return jsonResponse(200, { success: true, order });
  } catch (err) {
    console.error('Failed to fetch order:', err);
    return jsonResponse(500, { success: false, error: 'Failed to fetch order' });
  }
};
