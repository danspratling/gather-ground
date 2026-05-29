import type { APIRoute } from 'astro';
import { addBrevoContact, getNewsletterListIds } from '@/lib/brevo';
import { verifyTurnstile } from '@/lib/turnstile';

export const prerender = false;

/** Parse the request body from JSON or application/x-www-form-urlencoded. */
async function parseBody(request: Request): Promise<Record<string, unknown>> {
  const contentType = request.headers.get('content-type') ?? '';
  if (contentType.includes('application/json')) {
    return (await request.json()) as Record<string, unknown>;
  }
  if (contentType.includes('application/x-www-form-urlencoded')) {
    const formData = await request.formData();
    const obj: Record<string, unknown> = {};
    formData.forEach((value, key) => {
      obj[key] = value;
    });
    return obj;
  }
  throw new Error(`Unsupported Content-Type: ${contentType}`);
}

const jsonHeaders = { 'Content-Type': 'application/json' };

export const POST: APIRoute = async ({ request }) => {
  let body: Record<string, unknown>;
  try {
    body = await parseBody(request);
  } catch {
    return new Response(
      JSON.stringify({ success: false, error: 'Invalid request body' }),
      { status: 400, headers: jsonHeaders }
    );
  }

  const { email, turnstileToken } = body;

  if (!email || typeof email !== 'string') {
    return new Response(
      JSON.stringify({ success: false, error: 'Email is required' }),
      { status: 400, headers: jsonHeaders }
    );
  }

  const secretKey = import.meta.env.TURNSTILE_SECRET_KEY;
  if (secretKey) {
    if (typeof turnstileToken !== 'string' || !turnstileToken) {
      return new Response(
        JSON.stringify({ success: false, error: 'Bot verification required' }),
        { status: 400, headers: jsonHeaders }
      );
    }
    const valid = await verifyTurnstile(turnstileToken);
    if (!valid) {
      return new Response(
        JSON.stringify({ success: false, error: 'Bot verification failed' }),
        { status: 400, headers: jsonHeaders }
      );
    }
  }

  try {
    await addBrevoContact({
      email,
      listIds: getNewsletterListIds(),
    });
  } catch (err) {
    console.error('Newsletter subscription failed:', err);
    return new Response(
      JSON.stringify({ success: false, error: 'Failed to subscribe' }),
      { status: 502, headers: jsonHeaders }
    );
  }

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: jsonHeaders,
  });
};
