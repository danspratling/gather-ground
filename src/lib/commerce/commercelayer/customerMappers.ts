/**
 * Shared mappers from Commerce Layer JSON:API resources to vendor-neutral
 * shapes in `../types`.
 *
 * Used by `auth.ts`, `customer.ts`, and any future slices that read the
 * `customers` resource.
 */

import type { Customer } from '../types';

export interface CLAddressLike {
  id?: string;
  first_name?: string | null;
  last_name?: string | null;
  line_1?: string | null;
  line_2?: string | null;
  city?: string | null;
  state_code?: string | null;
  zip_code?: string | null;
  country_code?: string | null;
  phone?: string | null;
}

export interface CLCustomerLike {
  id: string;
  email: string;
  created_at: string;
  updated_at: string;
  metadata?: {
    first_name?: string;
    last_name?: string;
    phone?: string;
  } | null;
  customer_addresses?: Array<{ address?: CLAddressLike }>;
}

export function mapAddress(addr: CLAddressLike) {
  return {
    id: addr.id,
    firstName: addr.first_name ?? '',
    lastName: addr.last_name ?? '',
    line1: addr.line_1 ?? '',
    line2: addr.line_2 ?? undefined,
    city: addr.city ?? '',
    state: addr.state_code ?? undefined,
    postalCode: addr.zip_code ?? '',
    country: addr.country_code ?? '',
    phone: addr.phone ?? undefined,
  };
}

export function mapCustomer(clCustomer: CLCustomerLike): Customer {
  const meta = clCustomer.metadata ?? {};
  return {
    id: clCustomer.id,
    email: clCustomer.email,
    firstName: meta.first_name ?? '',
    lastName: meta.last_name ?? '',
    phone: meta.phone,
    addresses:
      clCustomer.customer_addresses
        ?.map((rel) => (rel.address ? mapAddress(rel.address) : null))
        .filter((a): a is ReturnType<typeof mapAddress> => a !== null) ?? [],
    createdAt: new Date(clCustomer.created_at),
    updatedAt: new Date(clCustomer.updated_at),
  };
}

export default null;
