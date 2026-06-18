/**
 * Commerce session cookie utilities
 *
 * Server-only helpers for the signed + encrypted `gg_session` cookie.
 * The cookie carries the Commerce Layer access token, optional refresh token,
 * and the customer id. It is sealed with `iron-session` so the contents are
 * unreadable and untamperable by the client.
 *
 * Cookie attributes: HttpOnly, Secure (prod), SameSite=Lax, Path=/,
 * Max-Age=30 days (rolling — every `setSession` resets the expiry).
 *
 * Consumers should only call these from Astro server endpoints, middleware,
 * or page frontmatter — never from a React island.
 */

import type { AstroCookies } from 'astro';
import { sealData, unsealData } from 'iron-session';

export const SESSION_COOKIE_NAME = 'gg_session';
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // 30 days

export interface SessionData {
  customerId: string;
  accessToken: string;
  refreshToken?: string;
  /** Unix seconds — when the CL access token itself expires. */
  expiresAt: number;
}

function getSessionSecret(): string {
  const secret = import.meta.env.SESSION_SECRET;
  if (typeof secret !== 'string' || secret.length < 32) {
    throw new Error(
      'SESSION_SECRET env var is required and must be at least 32 characters.'
    );
  }
  return secret;
}

function isProduction(): boolean {
  return import.meta.env.PROD === true;
}

function isValidSessionShape(data: unknown): data is SessionData {
  if (!data || typeof data !== 'object') return false;
  const d = data as Record<string, unknown>;
  if (typeof d.customerId !== 'string' || d.customerId.length === 0)
    return false;
  if (typeof d.accessToken !== 'string' || d.accessToken.length === 0)
    return false;
  if (typeof d.expiresAt !== 'number' || !Number.isFinite(d.expiresAt))
    return false;
  if (d.refreshToken !== undefined && typeof d.refreshToken !== 'string')
    return false;
  return true;
}

/**
 * Read and verify the session cookie.
 * Returns `null` if the cookie is absent, malformed, expired, or unsealing fails.
 * Throws if `SESSION_SECRET` is missing or invalid — that's a config error,
 * not a runtime auth failure, and must surface.
 */
export async function getSession(
  cookies: AstroCookies
): Promise<SessionData | null> {
  const raw = cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!raw) {
    return null;
  }

  // Read the secret outside the try/catch so config errors aren't swallowed
  // as a missing-session.
  const password = getSessionSecret();

  let data: unknown;
  try {
    data = await unsealData<unknown>(raw, {
      password,
      ttl: SESSION_MAX_AGE_SECONDS,
    });
  } catch {
    return null;
  }

  return isValidSessionShape(data) ? data : null;
}

/**
 * Write the session cookie with a fresh 30-day rolling expiry.
 */
export async function setSession(
  cookies: AstroCookies,
  data: SessionData
): Promise<void> {
  const sealed = await sealData(data, {
    password: getSessionSecret(),
    ttl: SESSION_MAX_AGE_SECONDS,
  });

  cookies.set(SESSION_COOKIE_NAME, sealed, {
    httpOnly: true,
    secure: isProduction(),
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
}

/**
 * Remove the session cookie.
 */
export function clearSession(cookies: AstroCookies): void {
  cookies.delete(SESSION_COOKIE_NAME, { path: '/' });
}
