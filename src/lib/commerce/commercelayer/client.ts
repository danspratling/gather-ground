/**
 * Commerce Layer SDK clients
 *
 * Server-only. Manages three client factories:
 * - Integration client (full permissions for syncs + webhooks; needs the
 *   integration client secret)
 * - Sales-channel client (catalog + cart; client-id + market scope only,
 *   no secret involved)
 * - Customer-scoped client (built from an existing customer access token)
 *
 * The v7 SDK requires an access token. We obtain one via @commercelayer/js-auth
 * using the configured credentials, then construct the CL SDK client.
 *
 * Env reads are split per role so the sales-channel path never touches the
 * integration secret. This keeps the failure modes scoped and avoids any
 * temptation to pull integration credentials into client bundles.
 */

import { authenticate } from '@commercelayer/js-auth';
import {
  CommerceLayer,
  type CommerceLayerBundle,
} from '@commercelayer/sdk/bundle';

interface CachedToken {
  accessToken: string;
  expiresAt: number;
}

let integrationTokenCache: CachedToken | null = null;
let salesChannelTokenCache: CachedToken | null = null;

function requireEnv(name: keyof ImportMetaEnv): string {
  const value = import.meta.env[name];
  if (typeof value !== 'string' || value.length === 0) {
    throw new Error(
      `Missing Commerce Layer environment variable: ${String(name)}`
    );
  }
  return value;
}

function getOrganization(): string {
  return requireEnv('COMMERCELAYER_ORGANIZATION');
}

function getIntegrationCredentials(): {
  clientId: string;
  clientSecret: string;
} {
  return {
    clientId: requireEnv('COMMERCELAYER_INTEGRATION_CLIENT_ID'),
    clientSecret: requireEnv('COMMERCELAYER_INTEGRATION_CLIENT_SECRET'),
  };
}

function getSalesChannelCredentials(): { clientId: string; scope: string } {
  return {
    clientId: requireEnv('COMMERCELAYER_SALES_CHANNEL_CLIENT_ID'),
    scope: `market:id:${requireEnv('COMMERCELAYER_MARKET_ID')}`,
  };
}

/**
 * Get an integration access token (full permissions).
 * Caches the token until ~60s before expiry. Expiry is computed from the
 * timestamp at which the token was received, not the request start, to avoid
 * over-caching when the auth call is slow.
 */
async function getIntegrationToken(): Promise<string> {
  if (
    integrationTokenCache &&
    integrationTokenCache.expiresAt > Date.now() + 60_000
  ) {
    return integrationTokenCache.accessToken;
  }

  const auth = await authenticate(
    'client_credentials',
    getIntegrationCredentials()
  );
  integrationTokenCache = {
    accessToken: auth.accessToken,
    expiresAt: Date.now() + auth.expiresIn * 1000,
  };
  return auth.accessToken;
}

/**
 * Get a sales-channel access token (scoped to the configured market).
 * Caches the token until ~60s before expiry. Expiry is computed from the
 * timestamp at which the token was received, not the request start.
 */
async function getSalesChannelToken(): Promise<string> {
  if (
    salesChannelTokenCache &&
    salesChannelTokenCache.expiresAt > Date.now() + 60_000
  ) {
    return salesChannelTokenCache.accessToken;
  }

  const auth = await authenticate(
    'client_credentials',
    getSalesChannelCredentials()
  );
  salesChannelTokenCache = {
    accessToken: auth.accessToken,
    expiresAt: Date.now() + auth.expiresIn * 1000,
  };
  return auth.accessToken;
}

/**
 * Get the integration SDK client (full permissions).
 */
export async function getIntegrationClient(): Promise<CommerceLayerBundle> {
  const organization = getOrganization();
  const accessToken = await getIntegrationToken();
  return CommerceLayer({ organization, accessToken });
}

/**
 * Get the sales-channel SDK client.
 */
export async function getSalesChannelClient(): Promise<CommerceLayerBundle> {
  const organization = getOrganization();
  const accessToken = await getSalesChannelToken();
  return CommerceLayer({ organization, accessToken });
}

/**
 * Build a customer-scoped SDK client from an existing customer access token.
 */
export function getCustomerClient(accessToken: string): CommerceLayerBundle {
  const organization = getOrganization();
  return CommerceLayer({ organization, accessToken });
}

/**
 * Clear all cached tokens. Used by tests.
 */
export function clearCLTokenCache(): void {
  integrationTokenCache = null;
  salesChannelTokenCache = null;
}

export default null;
