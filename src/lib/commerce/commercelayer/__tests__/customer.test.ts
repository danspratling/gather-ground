/**
 * Tests for Commerce Layer customer adapter (currently just getCustomer).
 * Mocks the CL JSON:API customers endpoint via MSW.
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
import * as customerAdapter from '../customer';
import { clearCLTokenCache } from '../client';

// jwtDecode throws on non-JWT strings; stub it so tests can pass plain tokens.
vi.mock('@commercelayer/js-auth', async (importOriginal) => {
  const actual =
    await importOriginal<typeof import('@commercelayer/js-auth')>();
  return {
    ...actual,
    jwtDecode: () => ({
      header: {},
      payload: { owner: { id: 'cust-me' } },
      signature: '',
    }),
  };
});

const mockOrganization = 'test-org';
const mockApiUrl = `https://${mockOrganization}.commercelayer.io/api`;

const server = setupServer();

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' });
  vi.stubEnv('COMMERCELAYER_ORGANIZATION', mockOrganization);
  vi.stubEnv('COMMERCELAYER_SALES_CHANNEL_CLIENT_ID', 'test-sales-channel-id');
  vi.stubEnv('COMMERCELAYER_INTEGRATION_CLIENT_ID', 'test-integration-id');
  vi.stubEnv(
    'COMMERCELAYER_INTEGRATION_CLIENT_SECRET',
    'test-integration-secret'
  );
  vi.stubEnv('COMMERCELAYER_MARKET_ID', 'XYZ');
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

function customerResource() {
  return {
    id: 'cust-me',
    type: 'customers',
    attributes: {
      email: 'me@example.com',
      created_at: '2026-01-01T00:00:00Z',
      updated_at: '2026-01-01T00:00:00Z',
      metadata: {
        first_name: 'Me',
        last_name: 'User',
        phone: '+44 1234 567890',
      },
    },
    relationships: { customer_addresses: { data: [] } },
  };
}

describe('Commerce Layer customer.getCustomer', () => {
  it('throws when no token is provided', async () => {
    await expect(customerAdapter.getCustomer('')).rejects.toThrow(
      /Token required/
    );
  });

  it('returns a vendor-neutral Customer for the authenticated session', async () => {
    server.use(
      // getCustomer() calls retrieve(customerId) decoded from JWT
      http.get(`${mockApiUrl}/customers/cust-me`, () =>
        HttpResponse.json({ data: customerResource() })
      )
    );

    const result = await customerAdapter.getCustomer('cust-token');

    expect(result.id).toBe('cust-me');
    expect(result.email).toBe('me@example.com');
    expect(result.firstName).toBe('Me');
    expect(result.lastName).toBe('User');
    expect(result.phone).toBe('+44 1234 567890');
  });

  it('throws when the customer list comes back empty', async () => {
    server.use(
      // retrieve() returning 404 is treated as "not found"
      http.get(`${mockApiUrl}/customers/cust-me`, () =>
        HttpResponse.json(
          { errors: [{ code: 'NOT_FOUND', detail: 'Customer not found' }] },
          { status: 404 }
        )
      )
    );

    await expect(customerAdapter.getCustomer('cust-token')).rejects.toThrow(
      /not found|Customer not found/i
    );
  });
});

// ---------------------------------------------------------------------------
// Helpers for order tests
// ---------------------------------------------------------------------------

function orderAttributes(overrides: Record<string, unknown> = {}) {
  return {
    number: '12345',
    status: 'approved',
    placed_at: '2026-01-15T10:00:00.000Z',
    currency_code: 'GBP',
    total_amount_with_taxes_float: 29.99,
    formatted_total_amount: '£29.99',
    skus_count: 2,
    subtotal_amount_float: 24.99,
    formatted_subtotal_amount: '£24.99',
    shipping_amount_float: 5.0,
    formatted_shipping_amount: '£5.00',
    ...overrides,
  };
}

function orderResource(overrides: Record<string, unknown> = {}) {
  return {
    id: 'ord-1',
    type: 'orders',
    attributes: orderAttributes(overrides),
    relationships: {
      line_items: { data: [] },
    },
  };
}

// ---------------------------------------------------------------------------
// listOrders
// ---------------------------------------------------------------------------

describe('Commerce Layer customer.listOrders', () => {
  it('throws when no token is provided', async () => {
    await expect(customerAdapter.listOrders('')).rejects.toThrow(
      /Token required/
    );
  });

  it('returns an empty list when there are no orders', async () => {
    server.use(
      http.get(`${mockApiUrl}/orders`, () =>
        HttpResponse.json({
          data: [],
          meta: { record_count: 0, page_count: 0 },
        })
      )
    );

    const result = await customerAdapter.listOrders('cust-token');

    expect(result.orders).toHaveLength(0);
    expect(result.total).toBe(0);
    expect(result.page).toBe(1);
  });

  it('returns mapped order summaries with correct shape', async () => {
    server.use(
      http.get(`${mockApiUrl}/orders`, () =>
        HttpResponse.json({
          data: [orderResource()],
          meta: { record_count: 1, page_count: 1 },
        })
      )
    );

    const result = await customerAdapter.listOrders('cust-token');

    expect(result.orders).toHaveLength(1);
    expect(result.total).toBe(1);
    expect(result.page).toBe(1);

    const order = result.orders[0];
    expect(order.id).toBe('ord-1');
    expect(order.number).toBe('12345');
    expect(order.status).toBe('confirmed');
    expect(order.total.amount).toBe(29.99);
    expect(order.total.currency).toBe('GBP');
    expect(order.lineItemCount).toBe(2);
    expect(order.placedAt).toBeInstanceOf(Date);
  });
});

// ---------------------------------------------------------------------------
// getOrder
// ---------------------------------------------------------------------------

describe('Commerce Layer customer.getOrder', () => {
  it('throws when no token is provided', async () => {
    await expect(customerAdapter.getOrder('', 'ord-1')).rejects.toThrow(
      /Token required/
    );
  });

  it('returns null when the order is not found (404)', async () => {
    server.use(
      http.get(`${mockApiUrl}/orders/ord-missing`, () =>
        HttpResponse.json(
          { errors: [{ code: 'NOT_FOUND', detail: 'Order not found' }] },
          { status: 404 }
        )
      )
    );

    const result = await customerAdapter.getOrder('cust-token', 'ord-missing');
    expect(result).toBeNull();
  });

  it('returns a mapped Order for a valid order ID', async () => {
    server.use(
      http.get(`${mockApiUrl}/orders/ord-1`, () =>
        HttpResponse.json({ data: orderResource() })
      )
    );

    const order = await customerAdapter.getOrder('cust-token', 'ord-1');

    expect(order).not.toBeNull();
    expect(order!.id).toBe('ord-1');
    expect(order!.number).toBe('12345');
    expect(order!.status).toBe('confirmed');
    expect(order!.total.amount).toBe(29.99);
    expect(order!.subtotal.amount).toBe(24.99);
    expect(order!.shippingCost?.amount).toBe(5.0);
    expect(order!.lineItems).toHaveLength(0);
  });
});

