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

  const {
    firstName,
    lastName,
    email,
    phone,
    message,
    consent,
    marketingOptIn,
    turnstileToken,
  } = body;

  if (
    typeof firstName !== 'string' ||
    typeof lastName !== 'string' ||
    typeof email !== 'string' ||
    typeof message !== 'string' ||
    !firstName.trim() ||
    !lastName.trim() ||
    !email.trim() ||
    !message.trim()
  ) {
    return new Response(
      JSON.stringify({ success: false, error: 'Missing required fields' }),
      { status: 400, headers: jsonHeaders }
    );
  }

  if (consent !== true) {
    return new Response(
      JSON.stringify({
        success: false,
        error: 'You must agree to the privacy policy',
      }),
      { status: 400, headers: jsonHeaders }
    );
  }

  const phoneStr =
    typeof phone === 'string' && phone.trim() ? phone.trim() : undefined;

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
    await sendContactEmail({
      firstName,
      lastName,
      email,
      phone: phoneStr,
      message,
    });
  } catch (err) {
    console.error('Contact email failed:', err);
    return new Response(
      JSON.stringify({ success: false, error: 'Failed to send email' }),
      { status: 502, headers: jsonHeaders }
    );
  }

  if (marketingOptIn === true) {
    try {
      await addBrevoContact({
        email,
        attributes: {
          FIRSTNAME: firstName,
          LASTNAME: lastName,
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
