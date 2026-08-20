/**
 * Integration test: CL stock change reflected in Sanity
 *
 * Simulates a Commerce Layer `stock_items.update` webhook and verifies that
 * `POST /api/sync/commerce-to-sanity` patches `inventoryStatus` on the
 * matching Sanity `productVariant` document.
 *
 * These tests require live credentials and a running deployment. They are
 * skipped in regular CI and only run when `RUN_INTEGRATION=true` is set
 * (e.g. nightly CI workflow).
 *
 * Required env vars (set in .env or CI secrets):
 *   INTEGRATION_BASE_URL            — deployed preview URL, e.g. https://gather-ground-pr-xx.vercel.app
 *   COMMERCELAYER_WEBHOOK_SECRET    — CL webhook signing secret
 *   SANITY_API_READ_TOKEN           — Sanity read token (to verify the patch)
 *   INTEGRATION_TEST_SKU            — an existing productVariant SKU in Sanity
 *
 * GG-200
 */

import { createHmac } from 'node:crypto';
import { createClient } from '@sanity/client';
import { test, expect } from '@playwright/test';

const RUN = process.env.RUN_INTEGRATION === 'true';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function clWebhookSignature(body: string, secret: string): string {
  return createHmac('sha256', secret).update(body).digest('hex');
}

function buildStockPayload(skuCode: string, quantity: number): string {
  return JSON.stringify({
    data: {
      type: 'stock_items',
      attributes: {
        sku_code: skuCode,
        quantity,
      },
    },
  });
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

test.describe('CL→Sanity stock sync', () => {
  test.skip(!RUN, 'Set RUN_INTEGRATION=true to run integration tests');

  const baseUrl = process.env.INTEGRATION_BASE_URL ?? '';
  const webhookSecret = process.env.COMMERCELAYER_WEBHOOK_SECRET ?? '';
  const testSku = process.env.INTEGRATION_TEST_SKU ?? '';

  const sanity = createClient({
    projectId: 'mrz1ftls',
    dataset: 'production',
    apiVersion: '2024-01-01',
    token: process.env.SANITY_API_READ_TOKEN ?? '',
    useCdn: false,
  });

  test('rejects a request with an invalid HMAC', async ({ request }) => {
    const body = buildStockPayload(testSku, 10);
    const res = await request.post(`${baseUrl}/api/sync/commerce-to-sanity`, {
      data: body,
      headers: {
        'content-type': 'application/json',
        'x-commercelayer-signature': 'invalid-signature',
        'x-commercelayer-topic': 'stock_items.update',
      },
    });
    expect(res.status()).toBe(401);
  });

  test('returns 200 and patches inventoryStatus for an in-stock quantity', async ({
    request,
  }) => {
    const body = buildStockPayload(testSku, 20);
    const sig = clWebhookSignature(body, webhookSecret);

    const res = await request.post(`${baseUrl}/api/sync/commerce-to-sanity`, {
      data: body,
      headers: {
        'content-type': 'application/json',
        'x-commercelayer-signature': sig,
        'x-commercelayer-topic': 'stock_items.update',
      },
    });
    expect(res.status()).toBe(200);

    // Poll Sanity for up to 5 s — CDN may have a small propagation lag
    let inventoryStatus: string | null = null;
    for (let i = 0; i < 10; i++) {
      const doc = await sanity.fetch<{ inventoryStatus?: string } | null>(
        `*[_type == "productVariant" && sku == $sku][0]{ inventoryStatus }`,
        { sku: testSku }
      );
      inventoryStatus = doc?.inventoryStatus ?? null;
      if (inventoryStatus === 'in_stock') break;
      await new Promise((r) => setTimeout(r, 500));
    }
    expect(inventoryStatus).toBe('in_stock');
  });

  test('patches inventoryStatus to out_of_stock for quantity 0', async ({
    request,
  }) => {
    const body = buildStockPayload(testSku, 0);
    const sig = clWebhookSignature(body, webhookSecret);

    const res = await request.post(`${baseUrl}/api/sync/commerce-to-sanity`, {
      data: body,
      headers: {
        'content-type': 'application/json',
        'x-commercelayer-signature': sig,
        'x-commercelayer-topic': 'stock_items.update',
      },
    });
    expect(res.status()).toBe(200);

    let inventoryStatus: string | null = null;
    for (let i = 0; i < 10; i++) {
      const doc = await sanity.fetch<{ inventoryStatus?: string } | null>(
        `*[_type == "productVariant" && sku == $sku][0]{ inventoryStatus }`,
        { sku: testSku }
      );
      inventoryStatus = doc?.inventoryStatus ?? null;
      if (inventoryStatus === 'out_of_stock') break;
      await new Promise((r) => setTimeout(r, 500));
    }
    expect(inventoryStatus).toBe('out_of_stock');
  });
});
