/**
 * Webhook HMAC signature verification utilities
 *
 * Shared by both sync routes so verification logic stays in one place and
 * is trivially unit-testable without spinning up a full API route.
 *
 * Commerce Layer:
 *   Header — `X-CommerceLayer-Signature: <hex-hmac>`
 *   Algorithm — HMAC-SHA256 over the raw request body
 *
 * Sanity GROQ webhooks:
 *   Header — `sanity-webhook-signature: t=<unix-seconds>,v1=<hex-hmac>`
 *   Algorithm — HMAC-SHA256 over `${timestamp}.${rawBody}`
 *   Replay protection — reject if |now - timestamp| > maxAgeMs (default 5 min)
 */

import { createHmac, timingSafeEqual } from 'node:crypto';

// ---------------------------------------------------------------------------
// Commerce Layer
// ---------------------------------------------------------------------------

/**
 * Verify a Commerce Layer webhook HMAC signature.
 * Returns `false` for any missing/malformed header rather than throwing.
 */
export function verifyCLSignature(
  rawBody: string,
  signatureHeader: string | null,
  secret: string
): boolean {
  if (!signatureHeader) return false;
  const expected = createHmac('sha256', secret).update(rawBody).digest('hex');
  try {
    return timingSafeEqual(
      Buffer.from(signatureHeader, 'hex'),
      Buffer.from(expected, 'hex')
    );
  } catch {
    // Buffer.from throws if the hex string has an odd length or invalid chars
    return false;
  }
}

// ---------------------------------------------------------------------------
// Sanity GROQ webhooks
// ---------------------------------------------------------------------------

/**
 * Verify a Sanity GROQ webhook signature with replay protection.
 * Returns `false` for any missing/malformed/expired header rather than throwing.
 *
 * @param maxAgeMs - Maximum age of a valid signature in milliseconds (default 5 min)
 */
export function verifySanitySignature(
  rawBody: string,
  signatureHeader: string | null,
  secret: string,
  maxAgeMs = 5 * 60 * 1000
): boolean {
  if (!signatureHeader) return false;
  const match = signatureHeader.match(/t=(\d+),v1=([0-9a-f]+)/);
  if (!match) return false;
  const [, timestampStr, receivedHmac] = match;
  const timestamp = Number(timestampStr);
  const age = Date.now() - timestamp * 1000;
  if (age > maxAgeMs || age < 0) return false;
  const expected = createHmac('sha256', secret)
    .update(`${timestampStr}.${rawBody}`)
    .digest('hex');
  try {
    return timingSafeEqual(
      Buffer.from(receivedHmac, 'hex'),
      Buffer.from(expected, 'hex')
    );
  } catch {
    return false;
  }
}

export default null;
