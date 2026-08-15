/**
 * Commerce Layer checkout methods
 *
 * Implements the checkout slice of the CommerceAdapter interface using the CL SDK.
 * Handles: customer attachment, email, shipping/billing address, shipping method selection.
 * Payment source creation and order placement are in separate tickets.
 *
 * All returned shapes are vendor-neutral (see ../types).
 */

import { jwtDecode } from '@commercelayer/js-auth';
import type { Address, Money, ShippingMethod } from '../types';
import { getIntegrationClient, getCustomerClient } from './client';

// ---------------------------------------------------------------------------
// CL-shape types (internal — never exported outside this file)
// ---------------------------------------------------------------------------

interface CLShippingMethodLike {
  id: string;
  name?: string | null;
  price_amount_cents?: number | null;
  formatted_price_amount?: string | null;
}

interface CLShipmentLike {
  available_shipping_methods?: CLShippingMethodLike[] | null;
}

interface CLOrderWithShipments {
  id: string;
  currency_code?: string | null;
  shipments?: CLShipmentLike[] | null;
}

interface CLShipmentSimple {
  id: string;
}

interface CLOrderWithShipmentsSimple {
  id: string;
  shipments?: CLShipmentSimple[] | null;
}

// ---------------------------------------------------------------------------
// Mappers
// ---------------------------------------------------------------------------

function mapMoney(
  cents: number | null | undefined,
  currency: string | null | undefined,
  formatted: string | null | undefined
): Money {
  return {
    amount: cents ?? 0,
    currency: currency ?? '',
    formatted: formatted ?? '',
  };
}

// ---------------------------------------------------------------------------
// Adapter methods
// ---------------------------------------------------------------------------

/**
 * Associate an authenticated customer token with the current order (cart).
 */
export async function attachCustomerToOrder(
  cartId: string,
  token: string
): Promise<void> {
  const decoded = jwtDecode(token);
  const customerId =
    decoded.payload &&
    'owner' in decoded.payload &&
    (decoded.payload as { owner?: { id?: string } }).owner?.id;
  if (!customerId) {
    throw new Error('Could not determine customer ID from access token');
  }

  const client = getCustomerClient(token);
  await (
    client.orders.update as unknown as (
      update: Record<string, unknown>
    ) => Promise<unknown>
  )({
    id: cartId,
    customer: client.customers.relationship(customerId),
  });
}

/**
 * Set the guest email on the order.
 */
export async function setOrderEmail(
  cartId: string,
  email: string
): Promise<void> {
  const client = await getIntegrationClient();
  await (
    client.orders.update as unknown as (
      update: Record<string, unknown>
    ) => Promise<unknown>
  )({
    id: cartId,
    customer_email: email,
  });
}

/**
 * Create a CL address resource and attach it as the shipping address.
 */
export async function setShippingAddress(
  cartId: string,
  address: Address
): Promise<void> {
  const client = await getIntegrationClient();
  const clAddress = await (
    client.addresses.create as unknown as (
      payload: Record<string, unknown>
    ) => Promise<{ id: string }>
  )({
    first_name: address.firstName,
    last_name: address.lastName,
    line_1: address.line1,
    ...(address.line2 ? { line_2: address.line2 } : {}),
    city: address.city,
    ...(address.state ? { state_code: address.state } : {}),
    zip_code: address.postalCode,
    country_code: address.country,
    ...(address.phone ? { phone: address.phone } : {}),
  });
  await (
    client.orders.update as unknown as (
      update: Record<string, unknown>
    ) => Promise<unknown>
  )({
    id: cartId,
    shipping_address: client.addresses.relationship(clAddress.id),
  });
}

/**
 * Create a CL address resource and attach it as the billing address.
 */
export async function setBillingAddress(
  cartId: string,
  address: Address
): Promise<void> {
  const client = await getIntegrationClient();
  const clAddress = await (
    client.addresses.create as unknown as (
      payload: Record<string, unknown>
    ) => Promise<{ id: string }>
  )({
    first_name: address.firstName,
    last_name: address.lastName,
    line_1: address.line1,
    ...(address.line2 ? { line_2: address.line2 } : {}),
    city: address.city,
    ...(address.state ? { state_code: address.state } : {}),
    zip_code: address.postalCode,
    country_code: address.country,
    ...(address.phone ? { phone: address.phone } : {}),
  });
  await (
    client.orders.update as unknown as (
      update: Record<string, unknown>
    ) => Promise<unknown>
  )({
    id: cartId,
    billing_address: client.addresses.relationship(clAddress.id),
  });
}

/**
 * List all available shipping methods for the order.
 * Requires the shipping address to already be set on the order.
 */
export async function listShippingMethods(
  cartId: string
): Promise<ShippingMethod[]> {
  const client = await getIntegrationClient();
  const order = (await client.orders.retrieve(cartId, {
    include: ['shipments.available_shipping_methods'],
  })) as unknown as CLOrderWithShipments;

  const shipments = order.shipments ?? [];
  const methods: ShippingMethod[] = [];

  for (const shipment of shipments) {
    for (const method of shipment.available_shipping_methods ?? []) {
      methods.push({
        id: method.id,
        name: method.name ?? '',
        cost: mapMoney(
          method.price_amount_cents,
          order.currency_code,
          method.formatted_price_amount
        ),
        estimatedDays: undefined,
      });
    }
  }

  return methods;
}

/**
 * Set the shipping method on the first shipment of the order.
 */
export async function setShippingMethod(
  cartId: string,
  shippingMethodId: string
): Promise<void> {
  const client = await getIntegrationClient();
  const order = (await client.orders.retrieve(cartId, {
    include: ['shipments'],
  })) as unknown as CLOrderWithShipmentsSimple;

  const shipmentId = order.shipments?.[0]?.id;
  if (!shipmentId) {
    throw new Error('No shipment found for order');
  }

  await (
    client.shipments.update as unknown as (
      update: Record<string, unknown>
    ) => Promise<unknown>
  )({
    id: shipmentId,
    shipping_method: client.shipping_methods.relationship(shippingMethodId),
  });
}

export default null;
