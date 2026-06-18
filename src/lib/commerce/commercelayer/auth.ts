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

interface CLAddressLike {
  id?: string;
  first_name?: string | null;
  last_name?: string | null;
  line_1?: string | null;
  line_2?: string | null;
  city?: string | null;
  state_code?: string | null;
  zip_code?: string | null;
  country_code?: string | null;
  phone?: string | null;
}

interface CLCustomerLike {
  id: string;
  email: string;
  created_at: string;
  updated_at: string;
  metadata?: {
    first_name?: string;
    last_name?: string;
    phone?: string;
  } | null;
  customer_addresses?: Array<{ address?: CLAddressLike }>;
}

function mapAddress(addr: CLAddressLike) {
  return {
    id: addr.id,
    firstName: addr.first_name ?? '',
    lastName: addr.last_name ?? '',
    line1: addr.line_1 ?? '',
    line2: addr.line_2 ?? undefined,
    city: addr.city ?? '',
    state: addr.state_code ?? undefined,
    postalCode: addr.zip_code ?? '',
    country: addr.country_code ?? '',
    phone: addr.phone ?? undefined,
  };
}

function mapCustomer(clCustomer: CLCustomerLike): Customer {
  const meta = clCustomer.metadata ?? {};
  return {
    id: clCustomer.id,
    email: clCustomer.email,
    firstName: meta.first_name ?? '',
    lastName: meta.last_name ?? '',
    phone: meta.phone,
    addresses:
      clCustomer.customer_addresses
        ?.map((rel) => (rel.address ? mapAddress(rel.address) : null))
        .filter((a): a is ReturnType<typeof mapAddress> => a !== null) ?? [],
    createdAt: new Date(clCustomer.created_at),
    updatedAt: new Date(clCustomer.updated_at),
  };
}

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
 * Authenticate a customer using their email + password.
 * Returns a customer-scoped access token and the customer profile.
 */
export async function login(
  email: string,
  password: string
): Promise<{ token: string; customer: Customer }> {
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
  const me = (await client.customers.list({
    filters: { email_eq: email },
    include: ['customer_addresses.address'],
  })) as unknown as { first: () => CLCustomerLike | undefined };

  const profile = me.first();
  if (!profile) {
    throw new Error(
      'Commerce Layer login succeeded but customer profile not found'
    );
  }

  return { token: auth.accessToken, customer: mapCustomer(profile) };
}

/**
 * Register a new customer account, then log them in.
 */
export async function register(
  email: string,
  password: string,
  firstName: string,
  lastName: string
): Promise<{ token: string; customer: Customer }> {
  const integration = await getIntegrationClient();

  await integration.customers.create({
    email,
    password,
    metadata: {
      first_name: firstName,
      last_name: lastName,
    },
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
 * Trigger a password-reset email for a customer.
 */
export async function requestPasswordReset(email: string): Promise<void> {
  const integration = await getIntegrationClient();
  await integration.customer_password_resets.create({
    customer_email: email,
  });
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
 */
export async function refreshSession(
  currentToken: string
): Promise<{ token: string; customer: Customer }> {
  if (!currentToken) {
    throw new Error('Token required to refresh session');
  }

  const client = getCustomerClient(currentToken);
  const list = (await client.customers.list({
    include: ['customer_addresses.address'],
    pageSize: 1,
  })) as unknown as { first: () => CLCustomerLike | undefined };

  const profile = list.first();
  if (!profile) {
    throw new Error('Session refresh failed: customer profile not found');
  }

  return { token: currentToken, customer: mapCustomer(profile) };
}

export default null;
