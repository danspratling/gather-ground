import type { APIRoute } from 'astro';
import { commerce } from '@/lib/commerce';
import { checkRateLimit } from '@/lib/commerce/rateLimit';
import {
  clientKey,
  isNonEmptyString,
  isValidPassword,
  jsonResponse,
  MIN_PASSWORD_LENGTH,
  parseJsonBody,
} from '@/lib/commerce/apiHelpers';

export const prerender = false;

const CONFIRM_RATE_LIMIT = { maxAttempts: 10, windowMs: 60_000 };

export const POST: APIRoute = async ({ request, clientAddress }) => {
  const body = await parseJsonBody(request);
  if (!body) {
    return jsonResponse(400, { success: false, error: 'Invalid request body' });
  }

  const { token, password } = body;
  if (!isNonEmptyString(token)) {
    return jsonResponse(400, { success: false, error: 'Reset token required' });
  }
  if (!isValidPassword(password)) {
    return jsonResponse(400, {
      success: false,
      error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters`,
    });
  }

  const limit = checkRateLimit(
    `password-reset-confirm:${clientKey(request, clientAddress)}`,
    CONFIRM_RATE_LIMIT
  );
  if (!limit.allowed) {
    return jsonResponse(
      429,
      { success: false, error: 'Too many requests' },
      { 'Retry-After': String(limit.retryAfter) }
    );
  }

  try {
    await commerce.confirmPasswordReset(token, password);
  } catch (err) {
    console.error('Commerce confirmPasswordReset failed:', err);
    return jsonResponse(400, {
      success: false,
      error: 'Reset link is invalid or has expired',
    });
  }

  return jsonResponse(200, { success: true });
};
