/**
 * Integration test: Sanity → Commerce Layer catalog sync
 *
 * Verifies that `POST /api/sync/sanity-to-commerce` correctly upserts a
 * productVariant SKU and price into the Commerce Layer sandbox when given a
 * valid HMAC-signed webhook payload.
 *
 * Note: CL does not expose a `stock_items.update` webhook topic. Inventory
 * status is fetched live from CL at render time via `getVariantInventory`
 * rather than being written back to Sanity. This test covers the
 * Sanity→CL direction only.
 *
 * These tests require live credentials and a running deployment. They are
 * skipped in regular CI and only run when `RUN_INTEGRATION=true` is set
 * (e.g. nightly CI workflow or manual trigger).
 *
 * Required env vars (set in .env or CI secrets):
 *   INTEGRATION_BASE_URL      — deployed preview URL
 *   SANITY_WEBHOOK_SECRET     — used to sign test payloads
 *   INTEGRATION_TEST_SKU      — an existing productVariant SKU in Sanity (e.g. GG-honey-jar-250g)
 *
 * GG-200
 */

import { createHmac } from 'node:crypto';
import { test, expect } from '@playwright/test';

const RUN = process.env.RUN_INTEGRATION === 'true';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function sanityWebhookSignature(
  timestamp: number,
  body: string,
  secret: string
): string {
  return createHmac('sha256', secret)
    .update(`${timestamp}.${body}`)
    .digest('hex');
}

function buildVariantPayload(sku: string): string {
  return JSON.stringify({
    _id: `integration-test-${sku}`,
    _type: 'productVariant',
    _deleted: false,
    sku,
    price: { amount: 1999, currency: 'GBP' },
  });
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

test.describe('Sanity→CL catalog sync', () => {
  test.skip(!RUN, 'Set RUN_INTEGRATION=true to run integration tests');

  const baseUrl = process.env.INTEGRATION_BASE_URL ?? '';
  const webhookSecret = process.env.SANITY_WEBHOOK_SECRET ?? '';
  const testSku = process.env.INTEGRATION_TEST_SKU ?? '';

  test('rejects a request with an invalid HMAC', async ({ request }) => {
    const body = buildVariantPayload(testSku);
    const ts = Math.floor(Date.now() / 1000);
    const res = await request.post(`${baseUrl}/api/sync/sanity-to-commerce`, {
      data: body,
      headers: {
        'content-type': 'application/json',
        'sanity-webhook-signature': `t=${ts},v1=invalidsignature`,
      },
    });
    expect(res.status()).toBe(401);
  });

  test('upserts a productVariant SKU into CL sandbox', async ({ request }) => {
    const body = buildVariantPayload(testSku);
    const ts = Math.floor(Date.now() / 1000);
    const sig = sanityWebhookSignature(ts, body, webhookSecret);

    const res = await request.post(`${baseUrl}/api/sync/sanity-to-commerce`, {
      data: body,
      headers: {
        'content-type': 'application/json',
        'sanity-webhook-signature': `t=${ts},v1=${sig}`,
      },
    });
    expect(res.status()).toBe(200);
    const json = await res.json();
    expect(json).toMatchObject({ ok: true, action: 'upserted', sku: testSku });
  });

  test('handles a delete event without error', async ({ request }) => {
    const payload = JSON.stringify({
      _id: `integration-test-${testSku}`,
      _type: 'productVariant',
      _deleted: true,
      sku: testSku,
    });
    const ts = Math.floor(Date.now() / 1000);
    const sig = sanityWebhookSignature(ts, payload, webhookSecret);

    const res = await request.post(`${baseUrl}/api/sync/sanity-to-commerce`, {
      data: payload,
      headers: {
        'content-type': 'application/json',
        'sanity-webhook-signature': `t=${ts},v1=${sig}`,
      },
    });
    expect(res.status()).toBe(200);
    const json = await res.json();
    expect(json).toMatchObject({ ok: true, action: 'deleted', sku: testSku });
  });
});
