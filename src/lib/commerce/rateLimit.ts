/**
 * Minimal in-memory sliding-window rate limiter.
 *
 * Process-local. Resets on cold start. Sufficient for low-traffic abuse
 * mitigation on auth endpoints, NOT a substitute for a CDN / WAF rule.
 */

const buckets = new Map<string, number[]>();

export interface RateLimitResult {
  allowed: boolean;
  /** Seconds until the next request would be allowed. 0 when `allowed`. */
  retryAfter: number;
}

export interface RateLimitOptions {
  maxAttempts: number;
  windowMs: number;
}

export function checkRateLimit(
  key: string,
  { maxAttempts, windowMs }: RateLimitOptions
): RateLimitResult {
  const now = Date.now();
  const history = (buckets.get(key) ?? []).filter((t) => now - t < windowMs);

  if (history.length >= maxAttempts) {
    const oldest = history[0] ?? now;
    return {
      allowed: false,
      retryAfter: Math.max(1, Math.ceil((windowMs - (now - oldest)) / 1000)),
    };
  }

  history.push(now);
  buckets.set(key, history);
  return { allowed: true, retryAfter: 0 };
}

/** Test-only — clears all in-memory buckets. */
export function resetRateLimit(): void {
  buckets.clear();
}
