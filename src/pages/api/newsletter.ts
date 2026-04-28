import type { APIRoute } from 'astro';
import { sendNewsletterWelcome } from '@/lib/email';
import { verifyTurnstile } from '@/lib/turnstile';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const body = (await request.json()) as Record<string, unknown>;
  const { email, turnstileToken } = body;

  if (!email || typeof email !== 'string') {
    return new Response(
      JSON.stringify({ success: false, error: 'Email is required' }),
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

  await sendNewsletterWelcome(email);

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
