/**
 * Commerce Layer customer methods
 *
 * Implements the customer-profile slice of the CommerceAdapter interface.
 * The current ticket (GG-E04-D) only needs `getCustomer`; the rest of the
 * slice (update, addresses, orders) land in their dedicated tickets.
 */

import { jwtDecode } from '@commercelayer/js-auth';
import type { Customer, Order, OrderSummary } from '../types';
import { getCustomerClient } from './client';
import {
  mapCustomer,
  mapOrderDetail,
  mapOrderSummary,
  type CLCustomerLike,
  type CLOrderDetailLike,
  type CLOrderLike,
} from './customerMappers';

/**
 * Fetch the authenticated customer's profile using their access token.
 *
 * Uses `retrieve(customerId)` rather than `list()` because a sales-channel
 * customer token cannot list all customers — it returns 401. The customer ID
 * is read from the JWT payload (the `owner_id` claim set by CL on password-
 * grant tokens) via `jwtDecode` from `@commercelayer/js-auth`.
 *
 * Throws on auth failure (401 from CL) — callers should treat this as an
 * expired session.
 */
export async function getCustomer(token: string): Promise<Customer> {
  if (!token) {
    throw new Error('Token required to fetch customer');
  }

  // Decode the JWT to find the customer's CL resource ID without an extra
  // network call. `jwtDecode` is synchronous and does not verify the signature.
  const decoded = jwtDecode(token);
  const customerId =
    decoded.payload &&
    'owner' in decoded.payload &&
    (decoded.payload as { owner?: { id?: string } }).owner?.id;
  if (!customerId) {
    throw new Error('Could not determine customer ID from access token');
  }

  const client = getCustomerClient(token);
  const profile = (await client.customers.retrieve(customerId, {
    include: ['customer_addresses.address'],
  })) as unknown as CLCustomerLike;

  if (!profile) {
    throw new Error('Customer profile not found for current session');
  }

  return mapCustomer(profile);
}


export async function listOrders(
  token: string,
  page: number = 1
): Promise<{ orders: OrderSummary[]; total: number; page: number }> {
  if (!token) throw new Error('Token required to list orders');

  const decoded = jwtDecode(token);
  const customerId =
    decoded.payload &&
    'owner' in decoded.payload &&
    (decoded.payload as { owner?: { id?: string } }).owner?.id;
  if (!customerId)
    throw new Error('Could not determine customer ID from access token');

  const client = getCustomerClient(token);
  const PAGE_SIZE = 10;
  const result = await client.orders.list({
    filters: { customer_id_eq: customerId, status_not_in: 'pending,draft' },
    sort: { placed_at: 'desc' },
    pageNumber: page,
    pageSize: PAGE_SIZE,
  });

  return {
    orders: [...result].map((o) =>
      mapOrderSummary(o as unknown as CLOrderLike)
    ),
    total: result.recordCount,
    page,
  };
}

export async function getOrder(
  token: string,
  orderId: string
): Promise<Order | null> {
  if (!token) throw new Error('Token required to get order');

  const decoded = jwtDecode(token);
  const customerId =
    decoded.payload &&
    'owner' in decoded.payload &&
    (decoded.payload as { owner?: { id?: string } }).owner?.id;
  if (!customerId)
    throw new Error('Could not determine customer ID from access token');

  const client = getCustomerClient(token);
  let raw: unknown;
  try {
    raw = await client.orders.retrieve(orderId, {
      include: ['line_items', 'shipping_address', 'billing_address'],
    });
  } catch (err: unknown) {
    if (
      err &&
      typeof err === 'object' &&
      'status' in err &&
      (err as { status: number }).status === 404
    ) {
      return null;
    }
    throw err;
  }

  const order = raw as CLOrderDetailLike & { customer_id?: string };
  if (order.customer_id && order.customer_id !== customerId) return null;

  return mapOrderDetail(order);
}
export default null;
