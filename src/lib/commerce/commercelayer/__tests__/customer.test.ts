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
    jwtDecode: () => ({ owner_id: 'cust-me' }),
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
