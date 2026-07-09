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
  getSession,
  setSession,
  type SessionData,
} from './session';
import { commerce } from './index';
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
    return { session: null, customer: null };
  }

  let token = existing.accessToken;
  let expiresAt = existing.expiresAt;
  let refreshed = false;

  if (expiresAt - now() < REFRESH_LEEWAY_SECONDS) {
    try {
      const refreshResult = await commerce.refreshSession(existing.accessToken);
      token = refreshResult.token;
      expiresAt = refreshResult.expiresAt;
      refreshed = true;
    } catch (err) {
      console.error('Commerce refreshSession failed:', err);
      clearSession(cookies);
      return { session: null, customer: null };
    }
  }

  let customer: Customer;
  try {
    customer = await commerce.getCustomer(token);
  } catch (err) {
    console.error('Commerce getCustomer failed:', err);
    clearSession(cookies);
    return { session: null, customer: null };
  }

  const nextSession: SessionData = {
    customerId: customer.id,
    accessToken: token,
    expiresAt,
    ...(existing.refreshToken ? { refreshToken: existing.refreshToken } : {}),
  };

  if (refreshed) {
    await setSession(cookies, nextSession);
  }

  return { session: nextSession, customer };
}
