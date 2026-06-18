import type { ConsoleMessage } from '@playwright/test';

const DEV_SERVER_TRANSIENT_PATTERNS = [
  /Failed to load resource.*504/i,
  /Failed to fetch dynamically imported module/i,
  /\[astro-island\] Error hydrating/i,
  /Astro.*Error while running audit's match function.*Failed to fetch/i,
];

export function isAppError(msg: ConsoleMessage): boolean {
  if (msg.type() !== 'error') return false;
  const text = msg.text();
  return !DEV_SERVER_TRANSIENT_PATTERNS.some((re) => re.test(text));
}
