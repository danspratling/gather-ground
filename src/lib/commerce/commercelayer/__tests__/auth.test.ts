/**
 * Tests for Commerce Layer auth adapter
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
import * as authAdapter from '../auth';
import { clearCLTokenCache } from '../client';

const mockOrganization = 'test-org';
const mockMarketId = 'XYZ';
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

// Minimal JSON:API customer resource matching what auth.ts expects
function customerResource(
  overrides: Partial<{ id: string; email: string }> = {}
) {
  return {
    id: overrides.id ?? 'cust-123',
    type: 'customers',
    attributes: {
      email: overrides.email ?? 'test@example.com',
      created_at: '2026-01-01T00:00:00Z',
      updated_at: '2026-01-01T00:00:00Z',
      metadata: {
        first_name: 'Test',
        last_name: 'User',
        phone: '+44 1234 567890',
      },
    },
    relationships: {
      customer_addresses: { data: [] },
    },
  };
}

function tokenResponse(accessToken: string) {
  return {
    access_token: accessToken,
    token_type: 'bearer',
    expires_in: 7200,
    scope: `market:id:${mockMarketId}`,
    created_at: Math.floor(Date.now() / 1000),
  };
}

describe('Commerce Layer Auth Adapter', () => {
  describe('login', () => {
    it('logs in a customer and returns token + profile', async () => {
      server.use(
        http.post(mockAuthUrl, () =>
          HttpResponse.json(tokenResponse('cust-token-abc'))
        ),
        http.get(`${mockApiUrl}/customers`, () =>
          HttpResponse.json({
            data: [customerResource()],
            meta: { record_count: 1 },
          })
        )
      );

      const result = await authAdapter.login('test@example.com', 'password123');

      expect(result.token).toBe('cust-token-abc');
      expect(result.customer.email).toBe('test@example.com');
      expect(result.customer.firstName).toBe('Test');
      expect(result.customer.lastName).toBe('User');
      const nowSeconds = Math.floor(Date.now() / 1000);
      expect(result.expiresAt).toBeGreaterThan(nowSeconds);
      expect(result.expiresAt).toBeLessThanOrEqual(nowSeconds + 7201);
    });

    it('throws when CL returns auth errors', async () => {
      server.use(
        http.post(mockAuthUrl, () =>
          HttpResponse.json(
            {
              errors: [
                { code: 'INVALID_GRANT', detail: 'Invalid credentials' },
              ],
            },
            { status: 401 }
          )
        )
      );

      await expect(
        authAdapter.login('test@example.com', 'wrong-password')
      ).rejects.toThrow(/Commerce Layer login failed/);
    });
  });

  describe('register', () => {
    it('creates a customer then logs them in', async () => {
      let createCalled = false;

      server.use(
        // Integration token for the create call, then password token for the login
        http.post(mockAuthUrl, () =>
          HttpResponse.json(tokenResponse('any-token'))
        ),
        http.post(`${mockApiUrl}/customers`, () => {
          createCalled = true;
          return HttpResponse.json(
            {
              data: customerResource({
                id: 'cust-456',
                email: 'newuser@example.com',
              }),
            },
            { status: 201 }
          );
        }),
        http.get(`${mockApiUrl}/customers`, () =>
          HttpResponse.json({
            data: [
              customerResource({
                id: 'cust-456',
                email: 'newuser@example.com',
              }),
            ],
            meta: { record_count: 1 },
          })
        )
      );

      const result = await authAdapter.register(
        'newuser@example.com',
        'password123',
        'New',
        'User'
      );

      expect(createCalled).toBe(true);
      expect(result.token).toBe('any-token');
      expect(result.customer.email).toBe('newuser@example.com');
    });

    it('throws when CL rejects the customer create call', async () => {
      server.use(
        http.post(mockAuthUrl, () =>
          HttpResponse.json(tokenResponse('integration-token'))
        ),
        http.post(`${mockApiUrl}/customers`, () =>
          HttpResponse.json(
            {
              errors: [
                {
                  code: 'VALIDATION_ERROR',
                  detail: 'email has already been taken',
                },
              ],
            },
            { status: 422 }
          )
        )
      );

      await expect(
        authAdapter.register('taken@example.com', 'password123', 'A', 'B')
      ).rejects.toThrow();
    });
  });

  describe('requestPasswordReset', () => {
    it('creates a customer_password_reset', async () => {
      let resetCalled = false;

      server.use(
        http.post(mockAuthUrl, () =>
          HttpResponse.json(tokenResponse('integration-token'))
        ),
        http.post(`${mockApiUrl}/customer_password_resets`, () => {
          resetCalled = true;
          return HttpResponse.json(
            {
              data: {
                id: 'reset-123',
                type: 'customer_password_resets',
                attributes: {},
              },
            },
            { status: 201 }
          );
        })
      );

      await expect(
        authAdapter.requestPasswordReset('test@example.com')
      ).resolves.toBeUndefined();
      expect(resetCalled).toBe(true);
    });

    it('throws when CL returns an error', async () => {
      server.use(
        http.post(mockAuthUrl, () =>
          HttpResponse.json(tokenResponse('integration-token'))
        ),
        http.post(`${mockApiUrl}/customer_password_resets`, () =>
          HttpResponse.json(
            { errors: [{ code: 'NOT_FOUND', detail: 'Customer not found' }] },
            { status: 404 }
          )
        )
      );

      await expect(
        authAdapter.requestPasswordReset('missing@example.com')
      ).rejects.toThrow();
    });
  });

  describe('confirmPasswordReset', () => {
    it('updates a customer_password_reset with the new password', async () => {
      let updateCalled = false;

      server.use(
        http.post(mockAuthUrl, () =>
          HttpResponse.json(tokenResponse('integration-token'))
        ),
        http.patch(`${mockApiUrl}/customer_password_resets/reset-123`, () => {
          updateCalled = true;
          return HttpResponse.json({
            data: {
              id: 'reset-123',
              type: 'customer_password_resets',
              attributes: {},
            },
          });
        })
      );

      await expect(
        authAdapter.confirmPasswordReset('reset-123', 'new-password')
      ).resolves.toBeUndefined();
      expect(updateCalled).toBe(true);
    });

    it('throws when CL rejects the reset token', async () => {
      server.use(
        http.post(mockAuthUrl, () =>
          HttpResponse.json(tokenResponse('integration-token'))
        ),
        http.patch(`${mockApiUrl}/customer_password_resets/expired-token`, () =>
          HttpResponse.json(
            {
              errors: [
                { code: 'INVALID_TOKEN', detail: 'Reset token expired' },
              ],
            },
            { status: 422 }
          )
        )
      );

      await expect(
        authAdapter.confirmPasswordReset('expired-token', 'new-password')
      ).rejects.toThrow();
    });
  });

  describe('logout', () => {
    it('rejects logout without a token', async () => {
      await expect(authAdapter.logout('')).rejects.toThrow(
        'Token required for logout'
      );
    });

    it('resolves when given a token (no-op server-side)', async () => {
      await expect(authAdapter.logout('some-token')).resolves.toBeUndefined();
    });
  });

  describe('refreshSession', () => {
    it('re-fetches the customer profile from the current token', async () => {
      server.use(
        http.get(`${mockApiUrl}/customers`, () =>
          HttpResponse.json({
            data: [customerResource()],
            meta: { record_count: 1 },
          })
        )
      );

      const result = await authAdapter.refreshSession('existing-token');

      expect(result.token).toBe('existing-token');
      expect(result.customer.email).toBe('test@example.com');
    });

    it('rejects when no token is provided', async () => {
      await expect(authAdapter.refreshSession('')).rejects.toThrow(
        'Token required'
      );
    });
  });
});
