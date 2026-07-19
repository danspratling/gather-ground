import type { APIRoute } from 'astro';
import { commerce, setSession, type SessionData } from '@/lib/commerce';
import { checkRateLimit } from '@/lib/commerce/rateLimit';
import {
  clientKey,
  isNonEmptyString,
  isValidEmail,
  isValidPassword,
  jsonResponse,
  MIN_PASSWORD_LENGTH,
  parseJsonBody,
} from '@/lib/commerce/apiHelpers';

export const prerender = false;

const REGISTER_RATE_LIMIT = { maxAttempts: 5, windowMs: 60_000 };

export const POST: APIRoute = async ({ request, cookies, clientAddress }) => {
  const body = await parseJsonBody(request);
  if (!body) {
    return jsonResponse(400, { success: false, error: 'Invalid request body' });
  }

  const { email, password, firstName, lastName } = body;

  if (!isValidEmail(email)) {
    return jsonResponse(400, { success: false, error: 'Invalid email' });
  }
  if (!isValidPassword(password)) {
    return jsonResponse(400, {
      success: false,
      error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters`,
    });
  }
  if (!isNonEmptyString(firstName) || !isNonEmptyString(lastName)) {
    return jsonResponse(400, {
      success: false,
      error: 'First name and last name are required',
    });
  }

  const limit = checkRateLimit(
    `register:${clientKey(request, clientAddress)}`,
    REGISTER_RATE_LIMIT
  );
  if (!limit.allowed) {
    return jsonResponse(
      429,
      { success: false, error: 'Too many requests' },
      { 'Retry-After': String(limit.retryAfter) }
    );
  }

  let result: Awaited<ReturnType<typeof commerce.register>>;
  try {
    result = await commerce.register(
      email,
      password,
      firstName.trim(),
      lastName.trim()
    );
  } catch (err) {
    // Log the full error so Vercel function logs (and local console) show the
    // real CL rejection reason — check logs at vercel.com → Functions tab.
    const message = err instanceof Error ? err.message : String(err);
    console.error('Commerce register failed:', message, err);
    // Generic 409 — we don't reveal whether the email is already taken,
    // matching CL's behaviour and avoiding account enumeration.
    return jsonResponse(409, {
      success: false,
      error:
        'We couldn’t create your account. If you already have an account, try signing in instead.',
    });
  }

  const session: SessionData = {
    customerId: result.customer.id,
    accessToken: result.token,
    expiresAt: result.expiresAt,
  };
  await setSession(cookies, session);

  return jsonResponse(201, {
    success: true,
    customer: {
      id: result.customer.id,
      email: result.customer.email,
      firstName: result.customer.firstName,
      lastName: result.customer.lastName,
    },
  });
};
