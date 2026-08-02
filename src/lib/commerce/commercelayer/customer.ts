/**
 * Commerce Layer customer methods
 *
 * Implements the customer-profile slice of the CommerceAdapter interface.
 * The current ticket (GG-E04-D) only needs `getCustomer`; the rest of the
 * slice (update, addresses, orders) land in their dedicated tickets.
 */

import { jwtDecode } from '@commercelayer/js-auth';
import type { Customer } from '../types';
import { getCustomerClient } from './client';
import { mapCustomer, type CLCustomerLike } from './customerMappers';

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
    decoded.payload && 'owner_id' in decoded.payload
      ? (decoded.payload as { owner_id?: string }).owner_id
      : undefined;
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

export default null;
