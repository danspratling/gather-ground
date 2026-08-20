/**
 * POST /api/sync/commerce-to-sanity
 *
 * Receives Commerce Layer webhook events and reflects stock changes back into
 * Sanity as `inventoryStatus` patches on the matching `productVariant` document.
 *
 * Supported CL topics:
 *   stock_items.update — recompute inventoryStatus from updated quantity
 *
 * Security: HMAC-SHA256 signature verified via X-CommerceLayer-Signature header
 * before any body parsing occurs.
 *
 * GG-195
 */

import type { APIRoute } from 'astro';
import { sanityClient } from 'sanity:client';
import { verifyCLSignature } from '@/lib/commerce/webhookSignature';
import type { InventoryStatus } from '@/lib/commerce/types';

export const prerender = false;

// ---------------------------------------------------------------------------
// CL webhook payload types (internal — not exported)
// ---------------------------------------------------------------------------

interface CLStockItemAttributes {
  sku_code?: string | null;
  quantity?: number | null;
}

interface CLWebhookPayload {
  data?: {
    type?: string;
    attributes?: CLStockItemAttributes;
  };
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function quantityToInventoryStatus(quantity: number): InventoryStatus {
  if (quantity === 0) return 'out_of_stock';
  if (quantity <= 5) return 'low_stock';
  return 'in_stock';
}

// ---------------------------------------------------------------------------
// Route
// ---------------------------------------------------------------------------

export const POST: APIRoute = async ({ request }) => {
  // 1. Read raw body — must happen before any parsing for HMAC verification
  const rawBody = await request.text();

  // 2. Verify CL HMAC signature
  const signature = request.headers.get('x-commercelayer-signature');
  const secret = import.meta.env.COMMERCELAYER_WEBHOOK_SECRET;
  if (!verifyCLSignature(rawBody, signature, secret)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // 3. Parse topic — silently ignore unrecognised events
  const topic = request.headers.get('x-commercelayer-topic') ?? '';
  if (topic !== 'stock_items.update') {
    return new Response(JSON.stringify({ ok: true, skipped: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // 4. Parse body
  let payload: CLWebhookPayload;
  try {
    payload = JSON.parse(rawBody) as CLWebhookPayload;
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const skuCode = payload.data?.attributes?.sku_code;
  const quantity = payload.data?.attributes?.quantity;

  if (!skuCode || typeof quantity !== 'number') {
    return new Response(
      JSON.stringify({ error: 'Missing sku_code or quantity' }),
      { status: 422, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // 5. Find the matching productVariant document in Sanity
  const writeClient = sanityClient.withConfig({
    token: import.meta.env.SANITY_API_WRITE_TOKEN,
    useCdn: false,
    perspective: 'published',
  });

  const variantDoc = await writeClient.fetch<{ _id: string } | null>(
    `*[_type == "productVariant" && sku == $sku][0]{ _id }`,
    { sku: skuCode }
  );

  if (!variantDoc) {
    // Not a known variant — not an error, just nothing to patch
    return new Response(
      JSON.stringify({ ok: true, message: 'Variant not found in Sanity' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // 6. Patch inventoryStatus
  const newStatus = quantityToInventoryStatus(quantity);
  await writeClient
    .patch(variantDoc._id)
    .set({ inventoryStatus: newStatus })
    .commit();

  return new Response(
    JSON.stringify({ ok: true, sku: skuCode, inventoryStatus: newStatus }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  );
};
