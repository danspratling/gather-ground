/**
 * Shared mappers from Commerce Layer JSON:API resources to vendor-neutral
 * shapes in `../types`.
 *
 * Used by `auth.ts`, `customer.ts`, and any future slices that read the
 * `customers` resource.
 */

import type {
  Customer,
  LineItem,
  Money,
  Order,
  OrderStatus,
  OrderSummary,
} from '../types';

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

export interface CLLineItemLike {
  id: string;
  sku_code?: string | null;
  name?: string | null;
  quantity?: number | null;
  unit_amount_float?: number | null;
  formatted_unit_amount?: string | null;
  total_amount_float?: number | null;
  formatted_total_amount?: string | null;
  currency_code?: string | null;
}

export interface CLOrderLike {
  id: string;
  number?: string | null;
  status?: string | null;
  placed_at?: string | null;
  currency_code?: string | null;
  total_amount_with_taxes_float?: number | null;
  formatted_total_amount?: string | null;
  skus_count?: number | null;
  customer_id?: string | null;
}

export interface CLOrderDetailLike extends CLOrderLike {
  subtotal_amount_float?: number | null;
  formatted_subtotal_amount?: string | null;
  shipping_amount_float?: number | null;
  formatted_shipping_amount?: string | null;
  line_items?: CLLineItemLike[] | null;
  shipping_address?: CLAddressLike | null;
  billing_address?: CLAddressLike | null;
}

function emptyAddress() {
  return {
    firstName: '',
    lastName: '',
    line1: '',
    city: '',
    postalCode: '',
    country: '',
  };
}

export function mapOrderStatus(status: string | null | undefined): OrderStatus {
  switch (status) {
    case 'approved':
    case 'placed':
      return 'confirmed';
    case 'fulfilled':
      return 'delivered';
    case 'cancelled':
      return 'cancelled';
    default:
      return 'pending';
  }
}

function makeMoney(
  amount: number | null | undefined,
  currency: string,
  formatted: string | null | undefined
): Money {
  return { amount: amount ?? 0, currency, formatted: formatted ?? '' };
}

export function mapOrderLineItem(
  li: CLLineItemLike,
  currency: string
): LineItem {
  return {
    id: li.id,
    variantId: li.sku_code ?? '',
    quantity: li.quantity ?? 1,
    price: makeMoney(
      li.unit_amount_float,
      li.currency_code ?? currency,
      li.formatted_unit_amount
    ),
    subtotal: makeMoney(
      li.total_amount_float,
      li.currency_code ?? currency,
      li.formatted_total_amount
    ),
    selectedOptions: {},
  };
}

export function mapOrderSummary(order: CLOrderLike): OrderSummary {
  return {
    id: order.id,
    number: order.number ?? '',
    status: mapOrderStatus(order.status),
    placedAt: new Date(order.placed_at ?? 0),
    total: makeMoney(
      order.total_amount_with_taxes_float,
      order.currency_code ?? 'GBP',
      order.formatted_total_amount
    ),
    lineItemCount: order.skus_count ?? 0,
  };
}

export function mapOrderDetail(order: CLOrderDetailLike): Order {
  const currency = order.currency_code ?? 'GBP';
  const lineItems = (order.line_items ?? []).map((li) =>
    mapOrderLineItem(li, currency)
  );

  return {
    id: order.id,
    number: order.number ?? '',
    customerId: order.customer_id ?? '',
    lineItems,
    subtotal: makeMoney(
      order.subtotal_amount_float,
      currency,
      order.formatted_subtotal_amount
    ),
    shippingCost:
      order.shipping_amount_float != null
        ? makeMoney(
            order.shipping_amount_float,
            currency,
            order.formatted_shipping_amount
          )
        : undefined,
    total: makeMoney(
      order.total_amount_with_taxes_float,
      currency,
      order.formatted_total_amount
    ),
    status: mapOrderStatus(order.status),
    shippingAddress: order.shipping_address
      ? mapAddress(order.shipping_address)
      : emptyAddress(),
    billingAddress: order.billing_address
      ? mapAddress(order.billing_address)
      : emptyAddress(),
    shippingMethod: {
      id: '',
      name: 'Standard',
      cost: { amount: 0, currency, formatted: '' },
    },
    paymentMethod: { id: '', type: 'card', displayName: 'Card' },
    createdAt: new Date(order.placed_at ?? 0),
    updatedAt: new Date(order.placed_at ?? 0),
  };
}
export default null;
