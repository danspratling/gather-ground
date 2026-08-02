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
// Address CRUD tests
// ---------------------------------------------------------------------------

const mockAddressAttrs = () => ({
  first_name: 'Jane',
  last_name: 'Doe',
  line_1: '123 Main St',
  line_2: null,
  city: 'London',
  state_code: null,
  zip_code: 'SW1A 1AA',
  country_code: 'GB',
  phone: null,
});

const mockCustomerAddressResource = (
  customerAddressId: string,
  addrId: string
) => ({
  id: customerAddressId,
  type: 'customer_addresses',
  attributes: {},
  relationships: {
    address: { data: { type: 'addresses', id: addrId } },
  },
});

describe('Commerce Layer customer.listAddresses', () => {
  it('returns mapped addresses for the customer', async () => {
    server.use(
      http.get(`${mockApiUrl}/customer_addresses`, () =>
        HttpResponse.json({
          data: [
            {
              id: 'ca-1',
              type: 'customer_addresses',
              attributes: {},
              relationships: {
                address: { data: { type: 'addresses', id: 'addr-1' } },
              },
            },
          ],
          included: [
            {
              id: 'addr-1',
              type: 'addresses',
              attributes: mockAddressAttrs(),
            },
          ],
        })
      )
    );

    const result = await customerAdapter.listAddresses('cust-token');

    expect(result).toHaveLength(1);
    expect(result[0]?.firstName).toBe('Jane');
    expect(result[0]?.lastName).toBe('Doe');
    expect(result[0]?.city).toBe('London');
    expect(result[0]?.postalCode).toBe('SW1A 1AA');
    expect(result[0]?.country).toBe('GB');
  });

  it('returns an empty array when the customer has no addresses', async () => {
    server.use(
      http.get(`${mockApiUrl}/customer_addresses`, () =>
        HttpResponse.json({ data: [] })
      )
    );

    const result = await customerAdapter.listAddresses('cust-token');
    expect(result).toEqual([]);
  });
});

describe('Commerce Layer customer.createAddress', () => {
  it('creates address and customer_address link and returns mapped address', async () => {
    server.use(
      http.post(`${mockApiUrl}/addresses`, () =>
        HttpResponse.json({
          data: {
            id: 'addr-new',
            type: 'addresses',
            attributes: mockAddressAttrs(),
          },
        })
      ),
      http.post(`${mockApiUrl}/customer_addresses`, () =>
        HttpResponse.json({
          data: {
            id: 'ca-new',
            type: 'customer_addresses',
            attributes: {},
          },
        })
      )
    );

    const result = await customerAdapter.createAddress('cust-token', {
      firstName: 'Jane',
      lastName: 'Doe',
      line1: '123 Main St',
      city: 'London',
      postalCode: 'SW1A 1AA',
      country: 'GB',
    });

    expect(result.firstName).toBe('Jane');
    expect(result.lastName).toBe('Doe');
    expect(result.city).toBe('London');
  });
});

describe('Commerce Layer customer.updateAddress', () => {
  it('patches the address resource and returns the updated address', async () => {
    server.use(
      http.patch(`${mockApiUrl}/addresses/addr-1`, () =>
        HttpResponse.json({
          data: {
            id: 'addr-1',
            type: 'addresses',
            attributes: { ...mockAddressAttrs(), city: 'Manchester' },
          },
        })
      )
    );

    const result = await customerAdapter.updateAddress('cust-token', 'addr-1', {
      city: 'Manchester',
    });

    expect(result.city).toBe('Manchester');
  });
});

describe('Commerce Layer customer.deleteAddress', () => {
  it('deletes the customer_address join record', async () => {
    server.use(
      http.get(`${mockApiUrl}/customer_addresses`, () =>
        HttpResponse.json({
          data: [mockCustomerAddressResource('ca-1', 'addr-1')],
        })
      ),
      http.delete(
        `${mockApiUrl}/customer_addresses/ca-1`,
        () => new HttpResponse(null, { status: 204 })
      )
    );

    await expect(
      customerAdapter.deleteAddress('cust-token', 'addr-1')
    ).resolves.toBeUndefined();
  });

  it('throws when the address is not found', async () => {
    server.use(
      http.get(`${mockApiUrl}/customer_addresses`, () =>
        HttpResponse.json({ data: [] })
      )
    );

    await expect(
      customerAdapter.deleteAddress('cust-token', 'addr-missing')
    ).rejects.toThrow(/not found/i);
  });
});

describe('Commerce Layer customer.setDefaultAddress', () => {
  it('updates the customer with default_shipping_address', async () => {
    server.use(
      http.patch(`${mockApiUrl}/customers/cust-me`, () =>
        HttpResponse.json({ data: { id: 'cust-me', type: 'customers' } })
      )
    );

    await expect(
      customerAdapter.setDefaultAddress('cust-token', 'addr-1', 'shipping')
    ).resolves.toBeUndefined();
  });

  it('updates the customer with default_billing_address', async () => {
    server.use(
      http.patch(`${mockApiUrl}/customers/cust-me`, () =>
        HttpResponse.json({ data: { id: 'cust-me', type: 'customers' } })
      )
    );

    await expect(
      customerAdapter.setDefaultAddress('cust-token', 'addr-1', 'billing')
    ).resolves.toBeUndefined();
  });
});
