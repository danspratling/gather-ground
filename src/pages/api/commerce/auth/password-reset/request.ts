import type { APIRoute } from 'astro';
import { commerce } from '@/lib/commerce';
import { checkRateLimit } from '@/lib/commerce/rateLimit';
import {
  clientKey,
  isValidEmail,
  jsonResponse,
  parseJsonBody,
} from '@/lib/commerce/apiHelpers';

export const prerender = false;

const RESET_RATE_LIMIT = { maxAttempts: 3, windowMs: 60_000 };

/**
 * Always returns 200 with `{ success: true }` regardless of whether the email
 * matches a known account. This prevents account enumeration via timing or
 * response shape.
 */
export const POST: APIRoute = async ({ request, clientAddress }) => {
  const body = await parseJsonBody(request);
  if (!body) {
    return jsonResponse(400, { success: false, error: 'Invalid request body' });
  }

  const { email } = body;
  if (!isValidEmail(email)) {
    return jsonResponse(400, { success: false, error: 'Invalid email' });
  }

  const limit = checkRateLimit(
    `password-reset:${clientKey(request, clientAddress)}`,
    RESET_RATE_LIMIT
  );
  if (!limit.allowed) {
    return jsonResponse(
      429,
      { success: false, error: 'Too many requests' },
      { 'Retry-After': String(limit.retryAfter) }
    );
  }

  try {
    await commerce.requestPasswordReset(email);
  } catch (err) {
    // Log internally but never tell the client whether the email existed.
    console.error('Commerce requestPasswordReset failed:', err);
  }

  return jsonResponse(200, { success: true });
};
