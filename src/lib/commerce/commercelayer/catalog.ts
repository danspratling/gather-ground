/**
 * Commerce Layer catalog adapter methods
 *
 * Implements inventory and price lookups using the CL SDK.
 * All returned shapes are vendor-neutral (see ../types).
 */

import type { InventoryStatus, Money } from '../types';
import { getSalesChannelClient } from './client';

const PRICE_LIST_ID = 'lRKvCwXrYL'; // uk-retail-gbp (docs/commerce-vendor-config.md)

// ---------------------------------------------------------------------------
// CL-shape types (internal — never exported outside this file)
// ---------------------------------------------------------------------------

interface CLStockItemLike {
  quantity?: number | null;
}

interface CLSkuLike {
  stock_items?: CLStockItemLike[] | null;
}

interface CLPriceLike {
  amount_cents?: number | null;
  currency_code?: string | null;
  formatted_amount?: string | null;
}

// ---------------------------------------------------------------------------
// Adapter methods
// ---------------------------------------------------------------------------

/**
 * Look up inventory status for a variant SKU.
 * Aggregates stock across all stock locations.
 */
export async function getVariantInventory(
  sku: string
): Promise<InventoryStatus> {
  const client = await getSalesChannelClient();
  const result = (await client.skus.list({
    filters: { code_eq: sku },
    include: ['stock_items'],
  })) as unknown as CLSkuLike[];
  const skuItem = result[0];
  if (!skuItem) return 'out_of_stock';
  const totalOnHand =
    skuItem.stock_items?.reduce((sum, si) => sum + (si.quantity ?? 0), 0) ?? 0;
  if (totalOnHand === 0) return 'out_of_stock';
  if (totalOnHand <= 5) return 'low_stock';
  return 'in_stock';
}

/**
 * Fetch the current price for a variant SKU from the uk-retail-gbp price list.
 * Throws if no price is found.
 */
export async function getVariantPrice(sku: string): Promise<Money> {
  const client = await getSalesChannelClient();
  const prices = (await client.prices.list({
    filters: {
      sku_code_eq: sku,
      price_list_id_eq: PRICE_LIST_ID,
    },
  })) as unknown as CLPriceLike[];
  const price = prices[0];
  if (!price) throw new Error(`No price found for SKU: ${sku}`);
  return {
    amount: price.amount_cents ?? 0,
    currency: price.currency_code ?? 'GBP',
    formatted: price.formatted_amount ?? '',
  };
}
