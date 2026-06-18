import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { checkRateLimit, resetRateLimit } from '../rateLimit';

beforeEach(() => {
  resetRateLimit();
  vi.useFakeTimers({ now: 1_000_000_000_000 });
});

afterEach(() => {
  vi.useRealTimers();
});

describe('checkRateLimit', () => {
  it('allows up to maxAttempts within the window', () => {
    const opts = { maxAttempts: 3, windowMs: 1000 };
    expect(checkRateLimit('k', opts).allowed).toBe(true);
    expect(checkRateLimit('k', opts).allowed).toBe(true);
    expect(checkRateLimit('k', opts).allowed).toBe(true);
  });

  it('blocks the next attempt once maxAttempts is exceeded', () => {
    const opts = { maxAttempts: 2, windowMs: 1000 };
    checkRateLimit('k', opts);
    checkRateLimit('k', opts);
    const blocked = checkRateLimit('k', opts);
    expect(blocked.allowed).toBe(false);
    expect(blocked.retryAfter).toBeGreaterThan(0);
  });

  it('treats keys independently', () => {
    const opts = { maxAttempts: 1, windowMs: 1000 };
    expect(checkRateLimit('a', opts).allowed).toBe(true);
    expect(checkRateLimit('b', opts).allowed).toBe(true);
    expect(checkRateLimit('a', opts).allowed).toBe(false);
  });

  it('expires old attempts after the window passes', () => {
    const opts = { maxAttempts: 1, windowMs: 1000 };
    checkRateLimit('k', opts);
    expect(checkRateLimit('k', opts).allowed).toBe(false);
    vi.advanceTimersByTime(1001);
    expect(checkRateLimit('k', opts).allowed).toBe(true);
  });
});
