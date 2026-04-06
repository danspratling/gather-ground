import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

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
