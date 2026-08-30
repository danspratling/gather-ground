/**
 * Backfill Commerce Layer from Sanity productVariant documents
 *
 * Reads every productVariant document in Sanity and upserts each one as a
 * SKU + price in Commerce Layer. Safe to re-run — CL upserts are idempotent.
 *
 * Prerequisites:
 *   1. At least one productVariant exists in Sanity with a valid `sku` and
 *      `price` (Human Gate A complete)
 *   2. All CL env vars set (see .env.example)
 *   3. COMMERCELAYER_SHIPPING_CATEGORY_ID set (required for new SKU creation)
 *
 * Usage (dry-run):
 *   SANITY_API_READ_TOKEN=... npx tsx scripts/backfill-cl-from-sanity.ts
 *
 * Usage (apply):
 *   SANITY_API_READ_TOKEN=... npx tsx scripts/backfill-cl-from-sanity.ts --apply
 *
 * GG-198
 */

import { createClient } from '@sanity/client';
import { authenticate } from '@commercelayer/js-auth';
import {
  CommerceLayer,
  type CommerceLayerBundle,
} from '@commercelayer/sdk/bundle';

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const APPLY = process.argv.includes('--apply');
const PRICE_LIST_ID = 'lRKvCwXrYL'; // uk-retail-gbp

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    console.error(`❌  Missing required env var: ${name}`);
    process.exit(1);
  }
  return value;
}

// ---------------------------------------------------------------------------
// Sanity client (read-only)
// ---------------------------------------------------------------------------

const sanity = createClient({
  projectId: 'mrz1ftls',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: requireEnv('SANITY_API_READ_TOKEN'),
  useCdn: false,
});

// ---------------------------------------------------------------------------
// CL client (integration)
// ---------------------------------------------------------------------------

async function getCLClient(): Promise<CommerceLayerBundle> {
  const organization = requireEnv('COMMERCELAYER_ORGANIZATION');
  const clientId = requireEnv('COMMERCELAYER_INTEGRATION_CLIENT_ID');
  const clientSecret = requireEnv('COMMERCELAYER_INTEGRATION_CLIENT_SECRET');
  const auth = await authenticate('client_credentials', {
    clientId,
    clientSecret,
  });
  return CommerceLayer({ organization, accessToken: auth.accessToken });
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface SanityVariant {
  _id: string;
  sku: string;
  price?: { amount?: number; currency?: string } | null;
  compareAtPrice?: { amount?: number; currency?: string } | null;
  weight?: number | null;
}

interface CLSkuLike {
  id?: string | null;
}

interface CLPriceLike {
  id?: string | null;
}

// ---------------------------------------------------------------------------
// Upsert helpers
// ---------------------------------------------------------------------------

async function upsertSku(
  client: CommerceLayerBundle,
  variant: SanityVariant,
  shippingCategoryId: string
): Promise<string> {
  const existing = (await client.skus.list({
    filters: { code_eq: variant.sku },
  })) as unknown as CLSkuLike[];

  if (existing.length > 0 && existing[0].id) {
    await client.skus.update({
      id: existing[0].id,
      name: variant.sku,
    } as unknown as Parameters<typeof client.skus.update>[0]);
    return existing[0].id;
  }

  const created = (await client.skus.create({
    code: variant.sku,
    name: variant.sku,
    shipping_category:
      client.shipping_categories.relationship(shippingCategoryId),
  } as unknown as Parameters<
    typeof client.skus.create
  >[0])) as unknown as CLSkuLike;

  if (!created.id)
    throw new Error(`SKU create returned no id for ${variant.sku}`);
  return created.id;
}

async function upsertPrice(
  client: CommerceLayerBundle,
  variant: SanityVariant,
  skuId: string
): Promise<void> {
  const amount = variant.price!.amount!;
  const currency = variant.price!.currency!;

  const existing = (await client.prices.list({
    filters: { sku_code_eq: variant.sku, price_list_id_eq: PRICE_LIST_ID },
  })) as unknown as CLPriceLike[];

  const payload: Record<string, unknown> = {
    amount_cents: amount,
    currency_code: currency,
  };
  if (variant.compareAtPrice?.amount) {
    payload.compare_at_amount_cents = variant.compareAtPrice.amount;
  }

  if (existing.length > 0 && existing[0].id) {
    await client.prices.update({
      id: existing[0].id,
      ...payload,
    } as unknown as Parameters<typeof client.prices.update>[0]);
  } else {
    await client.prices.create({
      ...payload,
      price_list: client.price_lists.relationship(PRICE_LIST_ID),
      sku: client.skus.relationship(skuId),
    } as unknown as Parameters<typeof client.prices.create>[0]);
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main(): Promise<void> {
  console.log(
    APPLY
      ? '🚀  Running in APPLY mode — changes will be written to Commerce Layer'
      : '🔍  Dry-run mode — no changes made. Pass --apply to commit.'
  );
  console.log();

  // 1. Fetch all productVariant documents from Sanity
  const variants = await sanity.fetch<SanityVariant[]>(
    `*[_type == "productVariant" && defined(sku)] | order(sku asc) {
      _id, sku,
      price{ amount, currency },
      compareAtPrice{ amount, currency },
      weight
    }`
  );

  console.log(`📦  Found ${variants.length} variant(s) in Sanity`);

  if (variants.length === 0) {
    console.log('Nothing to backfill. Exiting.');
    process.exit(0);
  }

  // 2. Filter to variants that have a price
  const ready = variants.filter((v) => v.price?.amount && v.price?.currency);
  const skipped = variants.length - ready.length;
  if (skipped > 0) {
    console.warn(
      `⚠️   Skipping ${skipped} variant(s) with missing price — set price in Studio first`
    );
  }
  if (ready.length === 0) {
    console.log('No variants with complete price data. Exiting.');
    process.exit(0);
  }

  if (!APPLY) {
    console.log('\nVariants to upsert (dry-run):');
    for (const v of ready) {
      console.log(`  ${v.sku}  £${((v.price!.amount ?? 0) / 100).toFixed(2)}`);
    }
    console.log('\nRe-run with --apply to write to Commerce Layer.');
    process.exit(0);
  }

  // 3. Connect to CL
  const shippingCategoryId = requireEnv('COMMERCELAYER_SHIPPING_CATEGORY_ID');
  const clClient = await getCLClient();

  // 4. Upsert each variant
  let succeeded = 0;
  let failed = 0;

  for (const variant of ready) {
    try {
      const skuId = await upsertSku(clClient, variant, shippingCategoryId);
      await upsertPrice(clClient, variant, skuId);
      console.log(`  ✅  ${variant.sku}`);
      succeeded++;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error(`  ❌  ${variant.sku} — ${msg}`);
      failed++;
    }
  }

  console.log(
    `\n🏁  Done — ${succeeded} succeeded, ${failed} failed out of ${ready.length}`
  );
  process.exit(failed > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error('Unexpected error:', err);
  process.exit(1);
});
