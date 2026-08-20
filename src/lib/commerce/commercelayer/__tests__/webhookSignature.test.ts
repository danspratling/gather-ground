/**
 * Tests for webhookSignature HMAC utilities
 *
 * Pure unit tests — no network, no Sanity, no Commerce Layer SDK.
 */

import { createHmac } from 'node:crypto';
import { describe, it, expect } from 'vitest';
import {
  verifyCLSignature,
  verifySanitySignature,
} from '../../webhookSignature';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function clSignature(body: string, secret: string): string {
  return createHmac('sha256', secret).update(body).digest('hex');
}

function sanitySignatureHeader(
  body: string,
  secret: string,
  timestampSeconds?: number
): string {
  const t = timestampSeconds ?? Math.floor(Date.now() / 1000);
  const hmac = createHmac('sha256', secret)
    .update(`${t}.${body}`)
    .digest('hex');
  return `t=${t},v1=${hmac}`;
}

// ---------------------------------------------------------------------------
// verifyCLSignature
// ---------------------------------------------------------------------------

describe('verifyCLSignature', () => {
  const secret = 'test-cl-secret';
  const body = '{"data":{"type":"stock_items"}}';

  it('returns true for a valid signature', () => {
    const sig = clSignature(body, secret);
    expect(verifyCLSignature(body, sig, secret)).toBe(true);
  });

  it('returns false for a tampered body', () => {
    const sig = clSignature(body, secret);
    expect(verifyCLSignature(body + 'x', sig, secret)).toBe(false);
  });

  it('returns false for a wrong secret', () => {
    const sig = clSignature(body, secret);
    expect(verifyCLSignature(body, sig, 'wrong-secret')).toBe(false);
  });

  it('returns false when signature header is null', () => {
    expect(verifyCLSignature(body, null, secret)).toBe(false);
  });

  it('returns false for a malformed (non-hex) signature', () => {
    expect(verifyCLSignature(body, 'not-hex!', secret)).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// verifySanitySignature
// ---------------------------------------------------------------------------

describe('verifySanitySignature', () => {
  const secret = 'test-sanity-secret';
  const body = '{"_type":"productVariant","sku":"GG-pork-500g"}';

  it('returns true for a valid fresh signature', () => {
    const header = sanitySignatureHeader(body, secret);
    expect(verifySanitySignature(body, header, secret)).toBe(true);
  });

  it('returns false for a tampered body', () => {
    const header = sanitySignatureHeader(body, secret);
    expect(verifySanitySignature(body + 'x', header, secret)).toBe(false);
  });

  it('returns false for a wrong secret', () => {
    const header = sanitySignatureHeader(body, secret);
    expect(verifySanitySignature(body, header, 'wrong-secret')).toBe(false);
  });

  it('returns false when signature header is null', () => {
    expect(verifySanitySignature(body, null, secret)).toBe(false);
  });

  it('returns false for a malformed header', () => {
    expect(verifySanitySignature(body, 'garbage', secret)).toBe(false);
  });

  it('rejects a replayed signature older than maxAgeMs', () => {
    const oldTs = Math.floor(Date.now() / 1000) - 400; // 400 s ago
    const header = sanitySignatureHeader(body, secret, oldTs);
    // Default maxAgeMs is 5 min = 300_000 ms — 400s > 5 min so should fail
    expect(verifySanitySignature(body, header, secret)).toBe(false);
  });

  it('accepts a signature within a custom maxAgeMs window', () => {
    const oldTs = Math.floor(Date.now() / 1000) - 400;
    const header = sanitySignatureHeader(body, secret, oldTs);
    expect(verifySanitySignature(body, header, secret, 600_000)).toBe(true);
  });

  it('rejects a future-dated signature', () => {
    const futureTs = Math.floor(Date.now() / 1000) + 120;
    const header = sanitySignatureHeader(body, secret, futureTs);
    expect(verifySanitySignature(body, header, secret)).toBe(false);
  });
});
