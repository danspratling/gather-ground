import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

/**
 * tailwind-merge doesn't know about custom `text-display-*` font-size utilities
 * (from @theme in global.css) and incorrectly treats them as the same group as
 * `text-{color}` utilities, stripping whichever appears first.
 * Registering them explicitly fixes the merge conflict.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': ['text-display-xl', 'text-display-lg', 'text-display-md'],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Returns true only for same-origin absolute paths (starts with `/` but not
 * `//`). Used in auth form redirect logic to prevent open-redirect attacks via
 * crafted `?next=https://evil.example` query params.
 */
export const isSafeRedirect = (value: string): boolean =>
  value.startsWith('/') && !value.startsWith('//');

/**
 * Resolves the post-auth redirect target in priority order:
 * 1. `redirectTo` prop (same-origin only)
 * 2. `?next=` query param (same-origin only)
 * 3. `/account`
 */
export const resolveRedirect = (redirectTo?: string): string => {
  if (redirectTo && isSafeRedirect(redirectTo)) return redirectTo;
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search);
    const next = params.get('next');
    if (next && isSafeRedirect(next)) return next;
  }
  return '/account';
};
