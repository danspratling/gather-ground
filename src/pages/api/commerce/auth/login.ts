import type { APIRoute } from 'astro';
import { commerce, setSession, type SessionData } from '@/lib/commerce';
import { getCartId, setCartId } from '@/lib/commerce/cart/cookies';
import { mergeCart } from '@/lib/commerce/cart/merge';
import { checkRateLimit } from '@/lib/commerce/rateLimit';
import {
  clientKey,
  isValidEmail,
  jsonResponse,
  parseJsonBody,
} from '@/lib/commerce/apiHelpers';

export const prerender = false;

const LOGIN_RATE_LIMIT = { maxAttempts: 10, windowMs: 60_000 };

export const POST: APIRoute = async ({ request, cookies, clientAddress }) => {
  const body = await parseJsonBody(request);
  if (!body) {
    return jsonResponse(400, { success: false, error: 'Invalid request body' });
  }

  const { email, password } = body;

  if (!isValidEmail(email)) {
    return jsonResponse(400, { success: false, error: 'Invalid email' });
  }
  if (typeof password !== 'string' || password.length === 0) {
    return jsonResponse(400, {
      success: false,
      error: 'Password is required',
    });
  }

  const limit = checkRateLimit(
    `login:${clientKey(request, clientAddress)}`,
    LOGIN_RATE_LIMIT
  );
  if (!limit.allowed) {
    return jsonResponse(
      429,
      { success: false, error: 'Too many requests' },
      { 'Retry-After': String(limit.retryAfter) }
    );
  }

  let result: Awaited<ReturnType<typeof commerce.login>>;
  try {
    result = await commerce.login(email, password);
  } catch (err) {
    console.error('Commerce login failed:', err);
    return jsonResponse(401, {
      success: false,
      error: 'Invalid email or password',
    });
  }

  const session: SessionData = {
    customerId: result.customer.id,
    accessToken: result.token,
    expiresAt: result.expiresAt,
  };
  await setSession(cookies, session);

  // Merge guest cart into customer cart if one exists
  const guestCartId = getCartId(cookies);
  if (guestCartId) {
    try {
      const merged = await mergeCart(guestCartId, result.customer.id);
      setCartId(cookies, merged.id);
    } catch {
      // Non-fatal — login succeeds even if cart merge fails
    }
  }

  return jsonResponse(200, {
    success: true,
    customer: {
      id: result.customer.id,
      email: result.customer.email,
      firstName: result.customer.firstName,
      lastName: result.customer.lastName,
    },
  });
};
