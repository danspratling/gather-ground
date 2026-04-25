import type { APIRoute } from 'astro';
import { sendContactEmail } from '@/lib/email';
import { verifyTurnstile } from '@/lib/turnstile';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const body = (await request.json()) as Record<string, unknown>;
  const { name, email, message, turnstileToken } = body;

  if (
    !name ||
    !email ||
    !message ||
    typeof name !== 'string' ||
    typeof email !== 'string' ||
    typeof message !== 'string'
  ) {
    return new Response(
      JSON.stringify({ success: false, error: 'Missing required fields' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  if (typeof turnstileToken === 'string' && turnstileToken) {
    const valid = await verifyTurnstile(turnstileToken);
    if (!valid) {
      return new Response(
        JSON.stringify({ success: false, error: 'Bot verification failed' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }

  await sendContactEmail({ name, email, message });

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
