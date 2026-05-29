import type { APIRoute } from 'astro';
import { sendContactEmail } from '@/lib/email';
import { addBrevoContact, getNewsletterListIds } from '@/lib/brevo';
import { verifyTurnstile } from '@/lib/turnstile';

export const prerender = false;

const jsonHeaders = { 'Content-Type': 'application/json' };

export const POST: APIRoute = async ({ request }) => {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return new Response(
      JSON.stringify({ success: false, error: 'Invalid request body' }),
      { status: 400, headers: jsonHeaders }
    );
  }

  const { name, email, message, marketingOptIn, turnstileToken } = body;

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
    await sendContactEmail({ name, email, message });
  } catch (err) {
    console.error('Contact email failed:', err);
    return new Response(
      JSON.stringify({ success: false, error: 'Failed to send email' }),
      { status: 502, headers: jsonHeaders }
    );
  }

  if (marketingOptIn === true) {
    try {
      const [firstName, ...rest] = name.trim().split(/\s+/);
      await addBrevoContact({
        email,
        attributes: {
          FIRSTNAME: firstName,
          LASTNAME: rest.join(' ') || undefined,
        },
        listIds: getNewsletterListIds(),
      });
    } catch (err) {
      // Don't fail the request — the message was delivered. Just log it.
      console.error('Brevo subscription from contact form failed:', err);
    }
  }

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: jsonHeaders,
  });
};
