/**
 * Commerce Layer auth methods
 *
 * Implements the auth slice of the CommerceAdapter interface using
 * @commercelayer/js-auth (token endpoints) and @commercelayer/sdk
 * (customer + password-reset resources).
 *
 * All returned shapes are vendor-neutral (see ../types).
 */

import { authenticate } from '@commercelayer/js-auth';
import type { Customer } from '../types';
import { getCustomerClient, getIntegrationClient } from './client';
import { mapCustomer, type CLCustomerLike } from './customerMappers';

function getSalesChannelClientId(): string {
  const id = import.meta.env.COMMERCELAYER_SALES_CHANNEL_CLIENT_ID;
  if (!id) {
    throw new Error('Missing COMMERCELAYER_SALES_CHANNEL_CLIENT_ID');
  }
  return id;
}

function getMarketScope(): string {
  const marketId = import.meta.env.COMMERCELAYER_MARKET_ID;
  if (!marketId) {
    throw new Error('Missing COMMERCELAYER_MARKET_ID');
  }
  return `market:id:${marketId}`;
}

/**
 * Default token TTL when CL doesn't surface one. CL's default is 2 hours.
 */
const DEFAULT_TOKEN_TTL_SECONDS = 60 * 60 * 2;

/**
 * Compute the absolute expiry (unix seconds) of an auth response, falling
 * back to `now + DEFAULT_TOKEN_TTL_SECONDS` if neither `expires` nor
 * `expiresIn` / `expires_in` is present.
 */
function expiresAtFromAuth(auth: unknown): number {
  const a = auth as {
    expires?: Date | string | null;
    expiresIn?: number | null;
    expires_in?: number | null;
  };

  if (a.expires) {
    const ms =
      a.expires instanceof Date
        ? a.expires.getTime()
        : new Date(a.expires).getTime();
    if (Number.isFinite(ms)) {
      return Math.floor(ms / 1000);
    }
  }

  const ttl =
    typeof a.expiresIn === 'number'
      ? a.expiresIn
      : typeof a.expires_in === 'number'
        ? a.expires_in
        : DEFAULT_TOKEN_TTL_SECONDS;
  return Math.floor(Date.now() / 1000) + ttl;
}

/**
 * Authenticate a customer using their email + password.
 * Returns a customer-scoped access token, the customer profile, and the
 * unix-seconds timestamp at which the access token expires.
 */
export async function login(
  email: string,
  password: string
): Promise<{ token: string; customer: Customer; expiresAt: number }> {
  const auth = await authenticate('password', {
    clientId: getSalesChannelClientId(),
    scope: getMarketScope(),
    username: email,
    password,
  });

  if (auth.errors?.length) {
    throw new Error(
      `Commerce Layer login failed: ${auth.errors[0]?.detail ?? 'unknown error'}`
    );
  }

  const client = getCustomerClient(auth.accessToken);

  // auth.ownerId is the customer's CL ID from the password-grant response.
  // Use retrieve() rather than list() — a customer-scoped token cannot list
  // all customers, only access its own record (CL UNAUTHORIZED otherwise).
  const profile = (await client.customers.retrieve(auth.ownerId, {
    include: ['customer_addresses.address'],
  })) as unknown as CLCustomerLike;

  if (!profile) {
    throw new Error(
      'Commerce Layer login succeeded but customer profile not found'
    );
  }

  return {
    token: auth.accessToken,
    customer: mapCustomer(profile),
    expiresAt: expiresAtFromAuth(auth),
  };
}

/**
 * Register a new customer account, then log them in.
 */
export async function register(
  email: string,
  password: string,
  firstName: string,
  lastName: string
): Promise<{ token: string; customer: Customer; expiresAt: number }> {
  const integration = await getIntegrationClient();

  await integration.customers.create({
    email,
    password,
    // Commerce Layer's customer resource has no first_name/last_name fields.
    // We store them in metadata so the mapCustomer mapper can read them back.
    // The SDK types restrict metadata to Record<string,unknown> which TypeScript
    // infers as incompatible with the concrete shape we need — cast to satisfy it.
    metadata: { first_name: firstName, last_name: lastName } as Record<
      string,
      unknown
    >,
  });

  return login(email, password);
}

/**
 * Log out by signalling the caller to drop the token.
 * Commerce Layer access tokens are stateless and short-lived; there is no
 * server-side revoke endpoint. Callers should clear stored tokens on receipt.
 */
export async function logout(token: string): Promise<void> {
  if (!token) {
    throw new Error('Token required for logout');
  }
  // No-op on the server. Caller is responsible for forgetting the token.
}

/**
 * Trigger a password-reset for a customer.
 * Returns the reset token from CL so the caller can send it in an email.
 */
export async function requestPasswordReset(
  email: string
): Promise<{ resetToken: string }> {
  const integration = await getIntegrationClient();
  const reset = await integration.customer_password_resets.create({
    customer_email: email,
  });
  const resetToken = (reset as unknown as { reset_password_token?: string })
    .reset_password_token;
  if (!resetToken) {
    throw new Error('CL did not return a reset_password_token');
  }
  return { resetToken };
}

/**
 * Complete a password reset using the token sent in the email and a new password.
 *
 * @param resetToken The reset token from the password-reset email.
 * @param newPassword The new password to set.
 */
export async function confirmPasswordReset(
  resetToken: string,
  newPassword: string
): Promise<void> {
  const integration = await getIntegrationClient();
  await integration.customer_password_resets.update({
    id: resetToken,
    customer_password: newPassword,
  });
}

/**
 * Refresh a customer session by re-fetching the profile from the existing token.
 * If the token has expired, CL returns 401 and the caller should re-login.
 *
 * CL access tokens are opaque and we don't have their original `expires_in`
 * available here, so callers should treat `expiresAt` as an upper bound
 * (`now + DEFAULT_TOKEN_TTL_SECONDS`) and re-login on the next 401.
 */
export async function refreshSession(
  currentToken: string
): Promise<{ token: string; customer: Customer; expiresAt: number }> {
  if (!currentToken) {
    throw new Error('Token required to refresh session');
  }

  // Decode the JWT to get the customer ID, then retrieve directly.
  // list() is not allowed with a customer-scoped token (CL 401).
  const { jwtDecode } = await import('@commercelayer/js-auth');
  const decoded = jwtDecode(currentToken);
  const customerId =
    'owner_id' in decoded
      ? (decoded as { owner_id?: string }).owner_id
      : undefined;
  if (!customerId) {
    throw new Error('Could not determine customer ID from access token');
  }

  const client = getCustomerClient(currentToken);
  const profile = (await client.customers.retrieve(customerId, {
    include: ['customer_addresses.address'],
  })) as unknown as CLCustomerLike;

  if (!profile) {
    throw new Error('Session refresh failed: customer profile not found');
  }

  return {
    token: currentToken,
    customer: mapCustomer(profile),
    expiresAt: Math.floor(Date.now() / 1000) + DEFAULT_TOKEN_TTL_SECONDS,
  };
}

export default null;
