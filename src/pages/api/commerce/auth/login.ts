import type { APIRoute } from 'astro';
import { commerce, setSession, type SessionData } from '@/lib/commerce';
import { checkRateLimit } from '@/lib/commerce/rateLimit';

export const prerender = false;

const jsonHeaders = { 'Content-Type': 'application/json' };

const LOGIN_RATE_LIMIT = { maxAttempts: 10, windowMs: 60_000 };

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function clientKey(
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

export const POST: APIRoute = async ({ request, cookies, clientAddress }) => {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return new Response(
      JSON.stringify({ success: false, error: 'Invalid request body' }),
      { status: 400, headers: jsonHeaders }
    );
  }

  const { email, password } = body;

  if (typeof email !== 'string' || !isValidEmail(email)) {
    return new Response(
      JSON.stringify({ success: false, error: 'Invalid email' }),
      { status: 400, headers: jsonHeaders }
    );
  }
  if (typeof password !== 'string' || password.length === 0) {
    return new Response(
      JSON.stringify({ success: false, error: 'Password is required' }),
      { status: 400, headers: jsonHeaders }
    );
  }

  const limit = checkRateLimit(
    `login:${clientKey(request, clientAddress)}`,
    LOGIN_RATE_LIMIT
  );
  if (!limit.allowed) {
    return new Response(
      JSON.stringify({ success: false, error: 'Too many requests' }),
      {
        status: 429,
        headers: { ...jsonHeaders, 'Retry-After': String(limit.retryAfter) },
      }
    );
  }

  let result: Awaited<ReturnType<typeof commerce.login>>;
  try {
    result = await commerce.login(email, password);
  } catch (err) {
    console.error('Commerce login failed:', err);
    return new Response(
      JSON.stringify({ success: false, error: 'Invalid email or password' }),
      { status: 401, headers: jsonHeaders }
    );
  }

  const session: SessionData = {
    customerId: result.customer.id,
    accessToken: result.token,
    expiresAt: result.expiresAt,
  };
  await setSession(cookies, session);

  return new Response(
    JSON.stringify({
      success: true,
      customer: {
        id: result.customer.id,
        email: result.customer.email,
        firstName: result.customer.firstName,
        lastName: result.customer.lastName,
      },
    }),
    { status: 200, headers: jsonHeaders }
  );
};
