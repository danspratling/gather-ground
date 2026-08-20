/**
 * POST /api/sync/sanity-to-commerce
 *
 * Receives Sanity GROQ webhook events for `productVariant` documents and
 * pushes the change to Commerce Layer:
 *
 *   create / update → upsert SKU + price in CL
 *   delete          → remove price + SKU from CL
 *
 * Security: Sanity webhook HMAC verified via `sanity-webhook-signature` header
 * before any body parsing occurs.
 *
 * GG-196
 */

import type { APIRoute } from 'astro';
import { commerce } from '@/lib/commerce';
import { verifySanitySignature } from '@/lib/commerce/webhookSignature';
import type { InventoryStatus } from '@/lib/commerce/types';

export const prerender = false;

// ---------------------------------------------------------------------------
// Sanity webhook payload type (internal)
// ---------------------------------------------------------------------------

interface SanityWebhookPayload {
  _id?: string;
  _type?: string;
  _deleted?: boolean;
  sku?: string;
  price?: { amount?: number; currency?: string } | null;
  compareAtPrice?: { amount?: number; currency?: string } | null;
  inventoryStatus?: InventoryStatus;
}

// ---------------------------------------------------------------------------
// Route
// ---------------------------------------------------------------------------

export const POST: APIRoute = async ({ request }) => {
  // 1. Read raw body — must happen before parsing for HMAC verification
  const rawBody = await request.text();

  // 2. Verify Sanity HMAC signature
  const signatureHeader = request.headers.get('sanity-webhook-signature');
  const secret = import.meta.env.SANITY_WEBHOOK_SECRET;
  if (!verifySanitySignature(rawBody, signatureHeader, secret)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // 3. Parse body
  let payload: SanityWebhookPayload;
  try {
    payload = JSON.parse(rawBody) as SanityWebhookPayload;
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // 4. Only handle productVariant documents
  if (payload._type !== 'productVariant') {
    return new Response(JSON.stringify({ ok: true, skipped: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const sku = payload.sku;

  // 5a. Delete event
  if (payload._deleted) {
    if (!sku) {
      // Sanity sends pre-delete state, but defend against missing sku
      return new Response(
        JSON.stringify({ error: 'Delete event missing sku field' }),
        { status: 422, headers: { 'Content-Type': 'application/json' } }
      );
    }
    await commerce.deleteVariant(sku);
    return new Response(
      JSON.stringify({ ok: true, action: 'deleted', sku }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // 5b. Create / update event
  if (!sku || !payload.price?.amount || !payload.price?.currency) {
    return new Response(
      JSON.stringify({ error: 'Missing required fields: sku, price.amount, price.currency' }),
      { status: 422, headers: { 'Content-Type': 'application/json' } }
    );
  }

  await commerce.upsertVariant({
    id: payload._id ?? sku,
    name: sku, // SKU code as display name — sufficient for CL catalog
    sku,
    price: {
      amount: payload.price.amount,
      currency: payload.price.currency,
      formatted: '', // display-only; not used by CL sync
    },
    compareAtPrice: payload.compareAtPrice?.amount
      ? {
          amount: payload.compareAtPrice.amount,
          currency: payload.compareAtPrice.currency ?? payload.price.currency,
          formatted: '',
        }
      : undefined,
    selectedOptions: {},
    inventoryStatus: payload.inventoryStatus ?? 'out_of_stock',
  });

  return new Response(
    JSON.stringify({ ok: true, action: 'upserted', sku }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  );
};
