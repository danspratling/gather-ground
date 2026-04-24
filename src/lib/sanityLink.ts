/**
 * Resolve a Sanity link object to a plain href string.
 * Mirrors the role of resolveLink() for Storyblok multilink fields.
 *
 * Strips stega-encoded invisible Unicode from URLs so they remain
 * valid hrefs when Visual Editing is enabled.
 */
import { stegaClean } from '@sanity/client/stega';

interface SanityLink {
  type?: 'url' | 'internal' | 'email';
  url?: string;
  internalLink?: { slug?: { current?: string } };
  email?: string;
}

export function resolveSanityLink(link: unknown): string {
  if (!link || typeof link !== 'object') return '';
  const l = stegaClean(link) as SanityLink;

  switch (l.type) {
    case 'email':
      return l.email ? `mailto:${l.email}` : '';
    case 'internal':
      return l.internalLink?.slug?.current
        ? `/${l.internalLink.slug.current}`.replace(/\/\//, '/')
        : '';
    case 'url':
    default:
      return l.url ?? '';
  }
}

export default null;
