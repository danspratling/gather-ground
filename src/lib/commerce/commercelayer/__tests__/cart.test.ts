/**
 * Tests for Commerce Layer cart adapter
 *
 * Mocks both auth.commercelayer.io (token endpoint) and the organisation's
 * CL JSON:API endpoints using MSW.
 */

import {
  describe,
  it,
  expect,
  beforeAll,
  beforeEach,
  afterEach,
  afterAll,
  vi,
} from 'vitest';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import * as cartAdapter from '../cart';
import { clearCLTokenCache } from '../client';

const mockOrganization = 'test-org';
const mockMarketId = 'mkt-XYZ';
const mockAuthUrl = 'https://auth.commercelayer.io/oauth/token';
const mockApiUrl = `https://${mockOrganization}.commercelayer.io/api`;

const server = setupServer();

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' });
  vi.stubEnv('COMMERCELAYER_ORGANIZATION', mockOrganization);
  vi.stubEnv('COMMERCELAYER_INTEGRATION_CLIENT_ID', 'test-integration-id');
  vi.stubEnv(
    'COMMERCELAYER_INTEGRATION_CLIENT_SECRET',
    'test-integration-secret'
  );
  vi.stubEnv('COMMERCELAYER_SALES_CHANNEL_CLIENT_ID', 'test-sales-channel-id');
  vi.stubEnv('COMMERCELAYER_MARKET_ID', mockMarketId);
});

beforeEach(() => {
  clearCLTokenCache();
});

afterEach(() => {
  server.resetHandlers();
});

afterAll(() => {
  server.close();
  vi.unstubAllEnvs();
});

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

function salesChannelTokenResponse() {
  return {
    access_token: 'sc-token-abc',
    token_type: 'bearer',
    expires_in: 7200,
    scope: `market:id:${mockMarketId}`,
    created_at: Math.floor(Date.now() / 1000),
  };
}

function orderResource(
  overrides: Partial<{
    id: string;
    subtotalCents: number;
    totalCents: number;
    currency: string;
    lineItemIds: string[];
  }> = {}
) {
  const id = overrides.id ?? 'ord-123';
  const currency = overrides.currency ?? 'GBP';
  const subtotalCents = overrides.subtotalCents ?? 0;
  const totalCents = overrides.totalCents ?? 0;
  const lineItemIds = overrides.lineItemIds ?? [];

  return {
    id,
    type: 'orders',
    attributes: {
      subtotal_amount_cents: subtotalCents,
      subtotal_amount_float: subtotalCents / 100,
      formatted_subtotal_amount: `£${(subtotalCents / 100).toFixed(2)}`,
      total_amount_cents: totalCents,
      total_amount_float: totalCents / 100,
      formatted_total_amount: `£${(totalCents / 100).toFixed(2)}`,
      currency_code: currency,
      created_at: '2026-01-01T00:00:00Z',
      updated_at: '2026-01-01T00:00:00Z',
    },
    relationships: {
      line_items: {
        data: lineItemIds.map((lid) => ({ type: 'line_items', id: lid })),
      },
    },
  };
}

function lineItemResource(
  overrides: Partial<{
    id: string;
    skuCode: string;
    quantity: number;
    unitAmountCents: number;
    currency: string;
  }> = {}
) {
  const id = overrides.id ?? 'li-456';
  const skuCode = overrides.skuCode ?? 'SKU001';
  const quantity = overrides.quantity ?? 1;
  const unitAmountCents = overrides.unitAmountCents ?? 999;
  const currency = overrides.currency ?? 'GBP';
  const totalAmountCents = unitAmountCents * quantity;

  return {
    id,
    type: 'line_items',
    attributes: {
      sku_code: skuCode,
      quantity,
      unit_amount_cents: unitAmountCents,
      unit_amount_float: unitAmountCents / 100,
      formatted_unit_amount: `£${(unitAmountCents / 100).toFixed(2)}`,
      total_amount_cents: totalAmountCents,
      total_amount_float: totalAmountCents / 100,
      formatted_total_amount: `£${(totalAmountCents / 100).toFixed(2)}`,
      currency_code: currency,
      created_at: '2026-01-01T00:00:00Z',
      updated_at: '2026-01-01T00:00:00Z',
    },
    relationships: {},
  };
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('createCart', () => {
  it('creates a new order and returns an empty cart', async () => {
    server.use(
      http.post(mockAuthUrl, () =>
        HttpResponse.json(salesChannelTokenResponse())
      ),
      http.post(`${mockApiUrl}/orders`, () =>
        HttpResponse.json({ data: orderResource() })
      )
    );

    const cart = await cartAdapter.createCart();

    expect(cart.id).toBe('ord-123');
    expect(cart.lineItems).toHaveLength(0);
    expect(cart.total.amount).toBe(0);
    expect(cart.total.currency).toBe('GBP');
  });

  it('throws when COMMERCELAYER_MARKET_ID is missing', async () => {
    vi.stubEnv('COMMERCELAYER_MARKET_ID', '');
    await expect(cartAdapter.createCart()).rejects.toThrow(
      /COMMERCELAYER_MARKET_ID/
    );
    vi.stubEnv('COMMERCELAYER_MARKET_ID', mockMarketId);
  });
});

describe('getCart', () => {
  it('retrieves a cart with its line items', async () => {
    server.use(
      http.post(mockAuthUrl, () =>
        HttpResponse.json(salesChannelTokenResponse())
      ),
      http.get(`${mockApiUrl}/orders/ord-123`, () =>
        HttpResponse.json({
          data: orderResource({
            subtotalCents: 1998,
            totalCents: 1998,
            lineItemIds: ['li-456'],
          }),
          included: [lineItemResource({ quantity: 2, unitAmountCents: 999 })],
        })
      )
    );

    const cart = await cartAdapter.getCart('ord-123');

    expect(cart.id).toBe('ord-123');
    expect(cart.lineItems).toHaveLength(1);
    expect(cart.lineItems[0]?.variantId).toBe('SKU001');
    expect(cart.lineItems[0]?.quantity).toBe(2);
    expect(cart.lineItems[0]?.price.amount).toBe(999);
    expect(cart.subtotal.amount).toBe(1998);
  });

  it('throws on a 404 response', async () => {
    server.use(
      http.post(mockAuthUrl, () =>
        HttpResponse.json(salesChannelTokenResponse())
      ),
      http.get(`${mockApiUrl}/orders/missing`, () =>
        HttpResponse.json(
          { errors: [{ status: '404', title: 'Record not found' }] },
          { status: 404 }
        )
      )
    );

    await expect(cartAdapter.getCart('missing')).rejects.toThrow();
  });
});

describe('addLineItem', () => {
  it('creates a line item and returns a mapped LineItem', async () => {
    server.use(
      http.post(mockAuthUrl, () =>
        HttpResponse.json(salesChannelTokenResponse())
      ),
      http.post(`${mockApiUrl}/line_items`, () =>
        HttpResponse.json({
          data: lineItemResource({ skuCode: 'SKU-NEW', quantity: 3 }),
        })
      )
    );

    const lineItem = await cartAdapter.addLineItem('ord-123', 'SKU-NEW', 3);

    expect(lineItem.variantId).toBe('SKU-NEW');
    expect(lineItem.quantity).toBe(3);
    expect(lineItem.price.amount).toBe(999);
  });

  it('throws on an API error', async () => {
    server.use(
      http.post(mockAuthUrl, () =>
        HttpResponse.json(salesChannelTokenResponse())
      ),
      http.post(`${mockApiUrl}/line_items`, () =>
        HttpResponse.json(
          { errors: [{ status: '422', title: 'Invalid quantity' }] },
          { status: 422 }
        )
      )
    );

    await expect(
      cartAdapter.addLineItem('ord-123', 'INVALID', 0)
    ).rejects.toThrow();
  });
});

describe('updateLineItem', () => {
  it('updates line item quantity and returns a mapped LineItem', async () => {
    server.use(
      http.post(mockAuthUrl, () =>
        HttpResponse.json(salesChannelTokenResponse())
      ),
      http.patch(`${mockApiUrl}/line_items/li-456`, () =>
        HttpResponse.json({
          data: lineItemResource({ quantity: 5 }),
        })
      )
    );

    const lineItem = await cartAdapter.updateLineItem('ord-123', 'li-456', 5);

    expect(lineItem.id).toBe('li-456');
    expect(lineItem.quantity).toBe(5);
  });

  it('throws on a 404 response', async () => {
    server.use(
      http.post(mockAuthUrl, () =>
        HttpResponse.json(salesChannelTokenResponse())
      ),
      http.patch(`${mockApiUrl}/line_items/missing`, () =>
        HttpResponse.json(
          { errors: [{ status: '404', title: 'Record not found' }] },
          { status: 404 }
        )
      )
    );

    await expect(
      cartAdapter.updateLineItem('ord-123', 'missing', 2)
    ).rejects.toThrow();
  });
});

describe('removeLineItem', () => {
  it('deletes a line item without returning a value', async () => {
    server.use(
      http.post(mockAuthUrl, () =>
        HttpResponse.json(salesChannelTokenResponse())
      ),
      http.delete(
        `${mockApiUrl}/line_items/li-456`,
        () => new HttpResponse(null, { status: 204 })
      )
    );

    await expect(
      cartAdapter.removeLineItem('ord-123', 'li-456')
    ).resolves.toBeUndefined();
  });

  it('throws on an API error', async () => {
    server.use(
      http.post(mockAuthUrl, () =>
        HttpResponse.json(salesChannelTokenResponse())
      ),
      http.delete(`${mockApiUrl}/line_items/bad-id`, () =>
        HttpResponse.json(
          { errors: [{ status: '404', title: 'Record not found' }] },
          { status: 404 }
        )
      )
    );

    await expect(
      cartAdapter.removeLineItem('ord-123', 'bad-id')
    ).rejects.toThrow();
  });
});

describe('mergeCart', () => {
  it('associates a guest order with a customer and returns the updated cart', async () => {
    server.use(
      http.post(mockAuthUrl, () =>
        HttpResponse.json(salesChannelTokenResponse())
      ),
      http.patch(`${mockApiUrl}/orders/ord-guest`, () =>
        HttpResponse.json({
          data: orderResource({
            id: 'ord-guest',
            subtotalCents: 500,
            totalCents: 500,
          }),
        })
      )
    );

    const cart = await cartAdapter.mergeCart('ord-guest', 'cust-123');

    expect(cart.id).toBe('ord-guest');
    expect(cart.total.amount).toBe(500);
  });

  it('throws on an API error', async () => {
    server.use(
      http.post(mockAuthUrl, () =>
        HttpResponse.json(salesChannelTokenResponse())
      ),
      http.patch(`${mockApiUrl}/orders/bad-cart`, () =>
        HttpResponse.json(
          { errors: [{ status: '422', title: 'Unprocessable' }] },
          { status: 422 }
        )
      )
    );

    await expect(
      cartAdapter.mergeCart('bad-cart', 'cust-456')
    ).rejects.toThrow();
  });
});
