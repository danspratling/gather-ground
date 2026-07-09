/**
 * Shared server-side session hydration.
 *
 * Reads the `gg_session` cookie, optionally refreshes the CL access token
 * when it's close to expiry, and returns both the validated session and the
 * current customer profile. On any failure the cookie is cleared and both
 * values come back `null` so callers can render a logged-out state without
 * further checks.
 *
 * Used by:
 *  - Astro middleware — to populate `locals.session` / `locals.customer`
 *  - `GET /api/commerce/auth/me` — to return the same shape to the browser
 */

import type { AstroCookies } from 'astro';
import {
  clearSession,
  commerce,
  getSession,
  setSession,
  type SessionData,
} from '@/lib/commerce';
import type { Customer } from './types';

/**
 * Margin (seconds) before `session.expiresAt` at which we proactively call
 * `commerce.refreshSession`. Keeps requests off the cliff-edge of an expiring
 * CL access token.
 */
export const REFRESH_LEEWAY_SECONDS = 60;

export interface HydratedSession {
  session: SessionData | null;
  customer: Customer | null;
  /**
   * `true` when a `gg_session` cookie was present but hydration failed
   * (refresh threw, or `getCustomer` threw). Distinguishes "logged out"
   * from "session went bad" so callers can render a different message.
   */
  sessionExpired: boolean;
}

export interface HydrateOptions {
  /** Injectable clock (unix seconds). Tests use this to force refresh. */
  now?: () => number;
}

export async function hydrateSession(
  cookies: AstroCookies,
  { now = () => Math.floor(Date.now() / 1000) }: HydrateOptions = {}
): Promise<HydratedSession> {
  const existing = await getSession(cookies);
  if (!existing) {
    return { session: null, customer: null, sessionExpired: false };
  }

  let token = existing.accessToken;
  let expiresAt = existing.expiresAt;
  let refreshedCustomer: Customer | null = null;

  if (expiresAt - now() < REFRESH_LEEWAY_SECONDS) {
    try {
      const refreshResult = await commerce.refreshSession(existing.accessToken);
      token = refreshResult.token;
      expiresAt = refreshResult.expiresAt;
      refreshedCustomer = refreshResult.customer;
    } catch (err) {
      console.error('Commerce refreshSession failed:', err);
      clearSession(cookies);
      return { session: null, customer: null, sessionExpired: true };
    }
  }

  // Reuse the customer returned by refreshSession when we just refreshed;
  // only call getCustomer when the existing token was still valid.
  let customer: Customer;
  if (refreshedCustomer) {
    customer = refreshedCustomer;
  } else {
    try {
      customer = await commerce.getCustomer(token);
    } catch (err) {
      console.error('Commerce getCustomer failed:', err);
      clearSession(cookies);
      return { session: null, customer: null, sessionExpired: true };
    }
  }

  const nextSession: SessionData = {
    customerId: customer.id,
    accessToken: token,
    expiresAt,
    ...(existing.refreshToken ? { refreshToken: existing.refreshToken } : {}),
  };

  if (refreshedCustomer) {
    await setSession(cookies, nextSession);
  }

  return { session: nextSession, customer, sessionExpired: false };
}

export default null;
