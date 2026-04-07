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
      'font-size': ['text-display-xl', 'text-display-md'],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface SbLink {
  linktype?: 'url' | 'story' | 'email' | 'asset';
  url?: string;
  cached_url?: string;
  email?: string;
}

/** Resolve a Storyblok multilink field to a plain href string. */
export function resolveLink(link: unknown): string {
  if (!link || typeof link !== 'object') return '';
  const l = link as SbLink;
  if (l.linktype === 'email') return `mailto:${l.email ?? ''}`;
  if (l.linktype === 'story')
    return `/${l.cached_url ?? ''}`.replace(/\/\//, '/');
  return l.url ?? l.cached_url ?? '';
}
