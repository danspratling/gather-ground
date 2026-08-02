/**
 * Commerce Layer cart methods
 *
 * Implements the cart slice of the CommerceAdapter interface using the CL SDK.
 * CL models carts as `orders`; line items are `line_items` resources.
 *
 * All returned shapes are vendor-neutral (see ../types).
 */

import type { Cart, LineItem, Money } from '../types';
import { getSalesChannelClient } from './client';

// ---------------------------------------------------------------------------
// CL-shape types (internal — never exported outside this file)
// ---------------------------------------------------------------------------

interface CLLineItemLike {
  id: string;
  sku_code?: string | null;
  quantity?: number | null;
  unit_amount_cents?: number | null;
  formatted_unit_amount?: string | null;
  total_amount_cents?: number | null;
  formatted_total_amount?: string | null;
  currency_code?: string | null;
}

interface CLOrderLike {
  id: string;
  subtotal_amount_cents?: number | null;
  formatted_subtotal_amount?: string | null;
  total_amount_cents?: number | null;
  formatted_total_amount?: string | null;
  currency_code?: string | null;
  line_items?: CLLineItemLike[] | null;
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

function mapLineItem(item: CLLineItemLike): LineItem {
  return {
    id: item.id,
    variantId: item.sku_code ?? '',
    quantity: item.quantity ?? 1,
    price: mapMoney(
      item.unit_amount_cents,
      item.currency_code,
      item.formatted_unit_amount
    ),
    subtotal: mapMoney(
      item.total_amount_cents,
      item.currency_code,
      item.formatted_total_amount
    ),
    selectedOptions: {},
  };
}

function mapCart(order: CLOrderLike): Cart {
  return {
    id: order.id,
    lineItems: (order.line_items ?? []).map(mapLineItem),
    subtotal: mapMoney(
      order.subtotal_amount_cents,
      order.currency_code,
      order.formatted_subtotal_amount
    ),
    total: mapMoney(
      order.total_amount_cents,
      order.currency_code,
      order.formatted_total_amount
    ),
  };
}

// ---------------------------------------------------------------------------
// Adapter methods
// ---------------------------------------------------------------------------

/**
 * Create a new guest cart (CL order scoped to the configured market).
 */
export async function createCart(): Promise<Cart> {
  const marketId = import.meta.env.COMMERCELAYER_MARKET_ID;
  if (!marketId) {
    throw new Error('Missing COMMERCELAYER_MARKET_ID');
  }

  const client = await getSalesChannelClient();
  const order = (await client.orders.create({
    market: client.markets.relationship(marketId),
  })) as unknown as CLOrderLike;

  // Newly created orders have no line items yet.
  return mapCart({ ...order, line_items: [] });
}

/**
 * Retrieve an existing cart with its line items.
 */
export async function getCart(cartId: string): Promise<Cart> {
  const client = await getSalesChannelClient();
  const order = (await client.orders.retrieve(cartId, {
    include: ['line_items'],
  })) as unknown as CLOrderLike;
  return mapCart(order);
}

/**
 * Add a SKU to the cart.
 * Setting `_update_quantity: true` increments the quantity instead of creating
 * a duplicate line item when the same SKU is already present.
 */
export async function addLineItem(
  cartId: string,
  variantId: string,
  quantity: number
): Promise<LineItem> {
  const client = await getSalesChannelClient();
  const item = (await client.line_items.create({
    sku_code: variantId,
    quantity,
    _update_quantity: true,
    order: client.orders.relationship(cartId),
  })) as unknown as CLLineItemLike;
  return mapLineItem(item);
}

/**
 * Update the quantity of an existing line item.
 * The `cartId` parameter is unused by CL (the line item already belongs to
 * the order) but kept to match the CommerceAdapter interface signature.
 */
export async function updateLineItem(
  _cartId: string,
  lineItemId: string,
  quantity: number
): Promise<LineItem> {
  const client = await getSalesChannelClient();
  const item = (await client.line_items.update({
    id: lineItemId,
    quantity,
  })) as unknown as CLLineItemLike;
  return mapLineItem(item);
}

/**
 * Remove a line item from the cart.
 */
export async function removeLineItem(
  _cartId: string,
  lineItemId: string
): Promise<void> {
  const client = await getSalesChannelClient();
  await client.line_items.delete(lineItemId);
}

/**
 * Associate a guest cart (order) with a customer account.
 * Called when a guest logs in so their cart is preserved.
 *
 * Not yet wired into the CommerceAdapter interface — will be added in Phase 4.
 */
export async function mergeCart(
  guestCartId: string,
  customerId: string
): Promise<Cart> {
  const client = await getSalesChannelClient();
  const order = (await client.orders.update({
    id: guestCartId,
    customer: client.customers.relationship(customerId),
  })) as unknown as CLOrderLike;
  return mapCart(order);
}

export default null;
