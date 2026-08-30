/**
 * POST /api/sync/commerce-to-sanity
 *
 * Receives Commerce Layer webhook events and applies them back to Sanity.
 *
 * Note: CL does not expose a `stock_items.update` webhook topic — inventory
 * status is fetched live from CL at render time via `getVariantInventory`
 * rather than being cached in Sanity. This route is reserved for order-event
 * fan-out (Wave 4: GG-E44-A/B) when orders.place / orders.fulfill events
 * need to be reflected in Sanity.
 *
 * Security: HMAC-SHA256 signature verified via X-CommerceLayer-Signature header
 * before any body parsing occurs.
 *
 * GG-195
 */

import type { APIRoute } from 'astro';
import { verifyCLSignature } from '@/lib/commerce/webhookSignature';

export const prerender = false;

// ---------------------------------------------------------------------------
// Route
// ---------------------------------------------------------------------------

export const POST: APIRoute = async ({ request }) => {
  // 1. Read raw body — must happen before any parsing for HMAC verification
  const rawBody = await request.text();

  // 2. Verify CL HMAC signature — reject unsigned requests regardless of topic
  const signature = request.headers.get('x-commercelayer-signature');
  const secret = import.meta.env.COMMERCELAYER_WEBHOOK_SECRET;
  if (!verifyCLSignature(rawBody, signature, secret)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // 3. All topics skipped until Wave 4 order-event fan-out is implemented.
  //    CL does not have a stock_items.update webhook topic — inventory status
  //    is fetched live from CL at render time via getVariantInventory instead.
  const topic = request.headers.get('x-commercelayer-topic') ?? 'unknown';
  return new Response(JSON.stringify({ ok: true, skipped: true, topic }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
