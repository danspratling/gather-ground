/**
 * Commerce Layer customer methods
 *
 * Implements the customer-profile slice of the CommerceAdapter interface.
 * The current ticket (GG-E04-D) only needs `getCustomer`; the rest of the
 * slice (update, addresses, orders) land in their dedicated tickets.
 * GG-240 adds address CRUD methods.
 */

import { jwtDecode } from '@commercelayer/js-auth';
import type { Address, Customer } from '../types';
import { getCustomerClient } from './client';
import {
  mapAddress,
  mapCustomer,
  type CLAddressLike,
  type CLCustomerLike,
} from './customerMappers';

/**
 * Fetch the authenticated customer's profile using their access token.
 */
export async function getCustomer(token: string): Promise<Customer> {
  if (!token) {
    throw new Error('Token required to fetch customer');
  }

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

// ---------------------------------------------------------------------------
// Address CRUD
// ---------------------------------------------------------------------------

function extractCustomerId(token: string): string {
  const decoded = jwtDecode(token);
  const id =
    decoded.payload &&
    'owner' in decoded.payload &&
    (decoded.payload as { owner?: { id?: string } }).owner?.id;
  if (!id) throw new Error('Could not determine customer ID from access token');
  return id;
}

export async function listAddresses(token: string): Promise<Address[]> {
  if (!token) throw new Error('Token required to list addresses');
  const client = getCustomerClient(token);
  const items = (await (
    client.customer_addresses as unknown as {
      list: (params: unknown) => Promise<Array<{ address?: CLAddressLike }>>;
    }
  ).list({ include: ['address'] })) as Array<{ address?: CLAddressLike }>;
  return [...(items ?? [])]
    .filter((item) => item.address)
    .map((item) => mapAddress(item.address!));
}

export async function createAddress(
  token: string,
  data: Omit<Address, 'id'>
): Promise<Address> {
  if (!token) throw new Error('Token required to create address');
  const customerId = extractCustomerId(token);
  const client = getCustomerClient(token);
  const addr = (await (
    client.addresses as unknown as {
      create: (
        attrs: Record<string, unknown>
      ) => Promise<CLAddressLike & { id: string }>;
    }
  ).create({
    first_name: data.firstName,
    last_name: data.lastName,
    line_1: data.line1,
    ...(data.line2 ? { line_2: data.line2 } : {}),
    city: data.city,
    zip_code: data.postalCode,
    country_code: data.country,
    ...(data.state ? { state_code: data.state } : {}),
    ...(data.phone ? { phone: data.phone } : {}),
  })) as CLAddressLike & { id: string };
  await (
    client.customer_addresses as unknown as {
      create: (attrs: Record<string, unknown>) => Promise<unknown>;
    }
  ).create({
    customer: { type: 'customers', id: customerId },
    address: { type: 'addresses', id: addr.id },
  });
  return mapAddress(addr);
}

export async function updateAddress(
  token: string,
  addressId: string,
  updates: Partial<Address>
): Promise<Address> {
  if (!token) throw new Error('Token required to update address');
  const client = getCustomerClient(token);
  const attrs: Record<string, unknown> = { id: addressId };
  if (updates.firstName !== undefined) attrs.first_name = updates.firstName;
  if (updates.lastName !== undefined) attrs.last_name = updates.lastName;
  if (updates.line1 !== undefined) attrs.line_1 = updates.line1;
  if (updates.line2 !== undefined) attrs.line_2 = updates.line2;
  if (updates.city !== undefined) attrs.city = updates.city;
  if (updates.postalCode !== undefined) attrs.zip_code = updates.postalCode;
  if (updates.country !== undefined) attrs.country_code = updates.country;
  if (updates.state !== undefined) attrs.state_code = updates.state;
  if (updates.phone !== undefined) attrs.phone = updates.phone;
  const updated = (await (
    client.addresses as unknown as {
      update: (attrs: Record<string, unknown>) => Promise<CLAddressLike>;
    }
  ).update(attrs)) as CLAddressLike;
  return mapAddress(updated);
}

export async function deleteAddress(
  token: string,
  addressId: string
): Promise<void> {
  if (!token) throw new Error('Token required to delete address');
  const client = getCustomerClient(token);
  const items = (await (
    client.customer_addresses as unknown as {
      list: (params: unknown) => Promise<Array<{ id: string }>>;
    }
  ).list({ filters: { address_id_eq: addressId } })) as Array<{ id: string }>;
  const customerAddress = items?.[0];
  if (!customerAddress) {
    throw new Error(`Address ${addressId} not found for this customer`);
  }
  await (
    client.customer_addresses as unknown as {
      delete: (id: string) => Promise<void>;
    }
  ).delete(customerAddress.id);
}

export async function setDefaultAddress(
  token: string,
  addressId: string,
  type: 'shipping' | 'billing'
): Promise<void> {
  if (!token) throw new Error('Token required to set default address');
  const customerId = extractCustomerId(token);
  const client = getCustomerClient(token);
  const field =
    type === 'shipping'
      ? 'default_shipping_address'
      : 'default_billing_address';
  await (
    client.customers as unknown as {
      update: (attrs: Record<string, unknown>) => Promise<unknown>;
    }
  ).update({ id: customerId, [field]: { type: 'addresses', id: addressId } });
}

// ---------------------------------------------------------------------------
// Profile + password management
// ---------------------------------------------------------------------------

/**
 * Update firstName, lastName, and/or email for the authenticated customer.
 * firstName/lastName are stored in CL's metadata; email is a direct attribute.
 */
export async function updateProfile(
  token: string,
  fields: { firstName?: string; lastName?: string; email?: string }
): Promise<void> {
  if (!token) throw new Error('Token required to update profile');
  const customerId = extractCustomerId(token);
  const client = getCustomerClient(token);
  const attrs: Record<string, unknown> = { id: customerId };
  const metadata: Record<string, string> = {};
  if (fields.firstName !== undefined) metadata.first_name = fields.firstName;
  if (fields.lastName !== undefined) metadata.last_name = fields.lastName;
  if (Object.keys(metadata).length > 0) attrs.metadata = metadata;
  if (fields.email !== undefined) attrs.email = fields.email;
  await (
    client.customers as unknown as {
      update: (attrs: Record<string, unknown>) => Promise<unknown>;
    }
  ).update(attrs);
}

/**
 * Change the password for the authenticated customer.
 * Throws `Error('INVALID_CURRENT_PASSWORD')` when CL rejects the current password (422).
 */
export async function changePassword(
  token: string,
  currentPassword: string,
  newPassword: string
): Promise<void> {
  if (!token) throw new Error('Token required to change password');
  const customerId = extractCustomerId(token);
  const client = getCustomerClient(token);
  try {
    await (
      client.customers as unknown as {
        update: (attrs: Record<string, unknown>) => Promise<unknown>;
      }
    ).update({
      id: customerId,
      password: newPassword,
      current_password: currentPassword,
    });
  } catch (err) {
    // CL SDK's ApiError exposes `status` as a number; 422 = invalid current password
    const maybeStatus = (err as { status?: number })?.status;
    if (maybeStatus === 422) {
      throw new Error('INVALID_CURRENT_PASSWORD');
    }
    throw err;
  }
}

export default null;
