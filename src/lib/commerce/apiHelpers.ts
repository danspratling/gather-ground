/**
 * Shared helpers for `/api/commerce/auth/*` routes.
 *
 * Keeps validation + rate-limit keying consistent across login, register,
 * logout, and password-reset endpoints.
 */

const jsonHeaders = { 'Content-Type': 'application/json' } as const;

export function jsonResponse(
  status: number,
  body: Record<string, unknown>,
  extraHeaders?: Record<string, string>
): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...jsonHeaders, ...extraHeaders },
  });
}

export function isValidEmail(value: unknown): value is string {
  return typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

/**
 * Minimum password length the API will accept on registration / reset.
 * Commerce Layer's own minimum is 8; we match it to fail fast before the
 * adapter call.
 */
export const MIN_PASSWORD_LENGTH = 8;

export function isValidPassword(value: unknown): value is string {
  return typeof value === 'string' && value.length >= MIN_PASSWORD_LENGTH;
}

export function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

/**
 * Derive a stable per-client key for rate-limiting. Prefers the leftmost
 * value of `x-forwarded-for` (closest client) and falls back to Astro's
 * `clientAddress`.
 */
export function clientKey(
  request: Request,
  clientAddress: string | undefined
): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    const first = forwarded.split(',')[0]?.trim();
    if (first) return first;
  }
  return clientAddress ?? 'unknown';
}

export async function parseJsonBody(
  request: Request
): Promise<Record<string, unknown> | null> {
  try {
    return (await request.json()) as Record<string, unknown>;
  } catch {
    return null;
  }
}
