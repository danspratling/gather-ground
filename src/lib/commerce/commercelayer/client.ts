/**
 * Commerce Layer SDK clients
 *
 * Manages two client factories:
 * - Integration client (server-side, full permissions for syncs + webhooks)
 * - Sales channel client (browser-safe, scoped to catalog + cart operations)
 *
 * The v7 SDK requires an access token. We obtain one via @commercelayer/js-auth
 * using the configured client credentials, then construct the CL SDK client.
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

interface CLEnvConfig {
  organization: string;
  integrationClientId: string;
  integrationClientSecret: string;
  salesChannelClientId: string;
  marketId: string;
}

/**
 * Read CL credentials from environment variables. Throws if any are missing.
 */
function getCLEnvConfig(): CLEnvConfig {
  const organization = import.meta.env.COMMERCELAYER_ORGANIZATION;
  const integrationClientId = import.meta.env
    .COMMERCELAYER_INTEGRATION_CLIENT_ID;
  const integrationClientSecret = import.meta.env
    .COMMERCELAYER_INTEGRATION_CLIENT_SECRET;
  const salesChannelClientId = import.meta.env
    .COMMERCELAYER_SALES_CHANNEL_CLIENT_ID;
  const marketId = import.meta.env.COMMERCELAYER_MARKET_ID;

  if (
    !organization ||
    !integrationClientId ||
    !integrationClientSecret ||
    !salesChannelClientId ||
    !marketId
  ) {
    throw new Error(
      'Missing Commerce Layer environment variables. Required: ' +
        'COMMERCELAYER_ORGANIZATION, COMMERCELAYER_INTEGRATION_CLIENT_ID, ' +
        'COMMERCELAYER_INTEGRATION_CLIENT_SECRET, COMMERCELAYER_SALES_CHANNEL_CLIENT_ID, ' +
        'COMMERCELAYER_MARKET_ID'
    );
  }

  return {
    organization,
    integrationClientId,
    integrationClientSecret,
    salesChannelClientId,
    marketId,
  };
}

/**
 * Get an integration access token (server-side, full permissions).
 * Caches the token until ~60s before expiry.
 */
async function getIntegrationToken(): Promise<string> {
  const now = Date.now();
  if (integrationTokenCache && integrationTokenCache.expiresAt > now + 60_000) {
    return integrationTokenCache.accessToken;
  }

  const env = getCLEnvConfig();
  const auth = await authenticate('client_credentials', {
    clientId: env.integrationClientId,
    clientSecret: env.integrationClientSecret,
  });

  integrationTokenCache = {
    accessToken: auth.accessToken,
    expiresAt: now + auth.expiresIn * 1000,
  };

  return auth.accessToken;
}

/**
 * Get a sales-channel access token (browser-safe, scoped to UK market).
 * Caches the token until ~60s before expiry.
 */
async function getSalesChannelToken(): Promise<string> {
  const now = Date.now();
  if (
    salesChannelTokenCache &&
    salesChannelTokenCache.expiresAt > now + 60_000
  ) {
    return salesChannelTokenCache.accessToken;
  }

  const env = getCLEnvConfig();
  const auth = await authenticate('client_credentials', {
    clientId: env.salesChannelClientId,
    scope: `market:id:${env.marketId}`,
  });

  salesChannelTokenCache = {
    accessToken: auth.accessToken,
    expiresAt: now + auth.expiresIn * 1000,
  };

  return auth.accessToken;
}

/**
 * Get the integration SDK client (server-side, full permissions).
 */
export async function getIntegrationClient(): Promise<CommerceLayerBundle> {
  const env = getCLEnvConfig();
  const accessToken = await getIntegrationToken();
  return CommerceLayer({ organization: env.organization, accessToken });
}

/**
 * Get the sales-channel SDK client (browser-safe).
 */
export async function getSalesChannelClient(): Promise<CommerceLayerBundle> {
  const env = getCLEnvConfig();
  const accessToken = await getSalesChannelToken();
  return CommerceLayer({ organization: env.organization, accessToken });
}

/**
 * Build a customer-scoped SDK client from an existing customer access token.
 */
export function getCustomerClient(accessToken: string): CommerceLayerBundle {
  const env = getCLEnvConfig();
  return CommerceLayer({ organization: env.organization, accessToken });
}

/**
 * Clear all cached tokens. Used by tests.
 */
export function clearCLTokenCache(): void {
  integrationTokenCache = null;
  salesChannelTokenCache = null;
}

export default null;
