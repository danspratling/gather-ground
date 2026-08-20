/**
 * Commerce Layer catalog sync methods
 *
 * Upserts and deletes SKUs + prices in CL from Sanity `productVariant` data.
 * Uses the integration client (full permissions) — never called client-side.
 *
 * GG-196
 */

import type { Variant } from '../types';
import { getIntegrationClient } from './client';

const PRICE_LIST_ID = 'lRKvCwXrYL'; // uk-retail-gbp (docs/commerce-vendor-config.md)

// ---------------------------------------------------------------------------
// CL-shape types (internal — never exported outside this file)
// ---------------------------------------------------------------------------

interface CLSkuLike {
  id?: string | null;
  code?: string | null;
}

interface CLPriceLike {
  id?: string | null;
}

// ---------------------------------------------------------------------------
// Adapter methods
// ---------------------------------------------------------------------------

/**
 * Upsert a SKU and its price in Commerce Layer.
 *
 * - If the SKU (by `variant.sku`) already exists, it is updated in place.
 * - If the price in the uk-retail-gbp price list already exists for this SKU,
 *   it is updated; otherwise a new price record is created.
 *
 * Requires COMMERCELAYER_SHIPPING_CATEGORY_ID env var for SKU creation.
 */
export async function upsertVariant(variant: Variant): Promise<void> {
  const client = await getIntegrationClient();
  const shippingCategoryId = import.meta.env.COMMERCELAYER_SHIPPING_CATEGORY_ID;

  // 1. Upsert SKU ────────────────────────────────────────────────────────────
  const existingSkus = (await client.skus.list({
    filters: { code_eq: variant.sku },
  })) as unknown as CLSkuLike[];

  let skuId: string;
  if (existingSkus.length > 0 && existingSkus[0].id) {
    const updateData = { id: existingSkus[0].id, name: variant.name };
    await client.skus.update(
      updateData as unknown as Parameters<typeof client.skus.update>[0]
    );
    skuId = existingSkus[0].id;
  } else {
    if (!shippingCategoryId) {
      throw new Error(
        'COMMERCELAYER_SHIPPING_CATEGORY_ID is required for SKU creation'
      );
    }
    const createData = {
      code: variant.sku,
      name: variant.name,
      shipping_category:
        client.shipping_categories.relationship(shippingCategoryId),
    };
    const created = (await client.skus.create(
      createData as unknown as Parameters<typeof client.skus.create>[0]
    )) as unknown as CLSkuLike;
    if (!created.id) throw new Error(`Failed to create SKU for ${variant.sku}`);
    skuId = created.id;
  }

  // 2. Upsert price ──────────────────────────────────────────────────────────
  const existingPrices = (await client.prices.list({
    filters: { sku_code_eq: variant.sku, price_list_id_eq: PRICE_LIST_ID },
  })) as unknown as CLPriceLike[];

  if (existingPrices.length > 0 && existingPrices[0].id) {
    const updateData: Record<string, unknown> = {
      id: existingPrices[0].id,
      amount_cents: variant.price.amount,
      currency_code: variant.price.currency,
    };
    if (variant.compareAtPrice) {
      updateData.compare_at_amount_cents = variant.compareAtPrice.amount;
    }
    await client.prices.update(
      updateData as unknown as Parameters<typeof client.prices.update>[0]
    );
  } else {
    const createData: Record<string, unknown> = {
      amount_cents: variant.price.amount,
      currency_code: variant.price.currency,
      price_list: client.price_lists.relationship(PRICE_LIST_ID),
      sku: client.skus.relationship(skuId),
    };
    if (variant.compareAtPrice) {
      createData.compare_at_amount_cents = variant.compareAtPrice.amount;
    }
    await client.prices.create(
      createData as unknown as Parameters<typeof client.prices.create>[0]
    );
  }
}

/**
 * Delete a variant's price and SKU from Commerce Layer by SKU code.
 * No-op if the SKU does not exist in CL.
 */
export async function deleteVariant(sku: string): Promise<void> {
  const client = await getIntegrationClient();

  const existingSkus = (await client.skus.list({
    filters: { code_eq: sku },
  })) as unknown as CLSkuLike[];

  if (existingSkus.length === 0 || !existingSkus[0].id) return;
  const skuId = existingSkus[0].id;

  // Delete price first (avoids an orphaned price_list entry)
  const existingPrices = (await client.prices.list({
    filters: { sku_code_eq: sku, price_list_id_eq: PRICE_LIST_ID },
  })) as unknown as CLPriceLike[];
  for (const price of existingPrices) {
    if (price.id) await client.prices.delete(price.id);
  }

  await client.skus.delete(skuId);
}
