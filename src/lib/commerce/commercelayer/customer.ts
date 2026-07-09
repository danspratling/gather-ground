/**
 * Commerce Layer customer methods
 *
 * Implements the customer-profile slice of the CommerceAdapter interface.
 * The current ticket (GG-E04-D) only needs `getCustomer`; the rest of the
 * slice (update, addresses, orders) land in their dedicated tickets.
 */

import type { Customer } from '../types';
import { getCustomerClient } from './client';
import { mapCustomer, type CLCustomerLike } from './customerMappers';

/**
 * Fetch the authenticated customer's profile using their access token.
 * Throws on auth failure (401 from CL) — callers should treat this as an
 * expired session.
 */
export async function getCustomer(token: string): Promise<Customer> {
  if (!token) {
    throw new Error('Token required to fetch customer');
  }

  const client = getCustomerClient(token);
  const list = (await client.customers.list({
    include: ['customer_addresses.address'],
    pageSize: 1,
  })) as unknown as { first: () => CLCustomerLike | undefined };

  const profile = list.first();
  if (!profile) {
    throw new Error('Customer profile not found for current session');
  }

  return mapCustomer(profile);
}

export default null;
