/**
 * Tests for Commerce Layer checkout adapter — placeOrder
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
import { placeOrder } from '../checkout';
import { clearCLTokenCache } from '../client';

const mockOrganization = 'test-org';
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
  vi.stubEnv('COMMERCELAYER_MARKET_ID', 'mkt-XYZ');
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

function integrationTokenResponse() {
  return {
    access_token: 'int-token-abc',
    token_type: 'bearer',
    expires_in: 7200,
    scope: 'integration',
    created_at: Math.floor(Date.now() / 1000),
  };
}

/** Minimal CL order resource returned by a retrieve() call (deserialized JSON:API) */
function pendingOrderResource(id = 'ord-pending') {
  return {
    data: {
      id,
      type: 'orders',
      attributes: {
        number: '1001',
        status: 'pending',
        placed_at: null,
        currency_code: 'GBP',
        subtotal_amount_float: 20.0,
        formatted_subtotal_amount: '£20.00',
        shipping_amount_float: 5.0,
        formatted_shipping_amount: '£5.00',
        total_amount_with_taxes_float: 25.0,
        formatted_total_amount: '£25.00',
        customer_id: null,
      },
      relationships: {
        line_items: { data: [] },
        shipping_address: { data: null },
        billing_address: { data: null },
      },
    },
  };
}

/** CL order resource already in 'placed' state */
function placedOrderResource(id = 'ord-placed') {
  return {
    data: {
      id,
      type: 'orders',
      attributes: {
        number: '1001',
        status: 'placed',
        placed_at: new Date().toISOString(),
        currency_code: 'GBP',
        subtotal_amount_float: 20.0,
        formatted_subtotal_amount: '£20.00',
        shipping_amount_float: 5.0,
        formatted_shipping_amount: '£5.00',
        total_amount_with_taxes_float: 25.0,
        formatted_total_amount: '£25.00',
        customer_id: null,
      },
      relationships: {
        line_items: { data: [] },
        shipping_address: { data: null },
        billing_address: { data: null },
      },
    },
  };
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('placeOrder', () => {
  it('transitions a pending order to placed and returns a mapped Order', async () => {
    server.use(
      http.post(mockAuthUrl, () =>
        HttpResponse.json(integrationTokenResponse())
      )
    );

    // The CL SDK _place() sends PATCH /api/orders/:id with { _place: true }
    // Track GET call count to return pending on first call, placed on subsequent
    let retrieveCallCount = 0;
    server.use(
      http.get(`${mockApiUrl}/orders/ord-1`, () => {
        retrieveCallCount++;
        return retrieveCallCount === 1
          ? HttpResponse.json(pendingOrderResource('ord-1'))
          : HttpResponse.json(placedOrderResource('ord-1'));
      }),
      http.patch(`${mockApiUrl}/orders/ord-1`, () =>
        HttpResponse.json(placedOrderResource('ord-1'))
      )
    );

    const order = await placeOrder('ord-1', 'pi_test_abc');

    expect(order.id).toBe('ord-1');
    expect(order.status).toBe('confirmed'); // mapOrderStatus('placed') → 'confirmed'
    expect(order.total.amount).toBe(25.0);
  });

  it('is idempotent — does not call _place() when order is already placed', async () => {
    server.use(
      http.post(mockAuthUrl, () =>
        HttpResponse.json(integrationTokenResponse())
      )
    );

    let placeCalled = false;
    server.use(
      http.get(`${mockApiUrl}/orders/ord-placed`, () =>
        HttpResponse.json(placedOrderResource('ord-placed'))
      ),
      http.patch(`${mockApiUrl}/orders/ord-placed`, () => {
        placeCalled = true;
        return HttpResponse.json(placedOrderResource('ord-placed'));
      })
    );

    const order = await placeOrder('ord-placed', 'pi_test_abc');

    expect(placeCalled).toBe(false);
    expect(order.id).toBe('ord-placed');
    expect(order.status).toBe('confirmed');
  });

  it('propagates CL errors as thrown Error instances', async () => {
    server.use(
      http.post(mockAuthUrl, () =>
        HttpResponse.json(integrationTokenResponse())
      ),
      http.get(`${mockApiUrl}/orders/ord-error`, () =>
        HttpResponse.json(pendingOrderResource('ord-error'))
      ),
      // _place() returns 422 — SDK should throw
      http.patch(`${mockApiUrl}/orders/ord-error`, () =>
        HttpResponse.json(
          {
            errors: [
              {
                title: 'Payment failed',
                detail: 'Card declined',
                status: '422',
                code: 'PAYMENT_FAILED',
              },
            ],
          },
          { status: 422 }
        )
      )
    );

    await expect(placeOrder('ord-error', 'pi_test_fail')).rejects.toThrow();
  });
});
