import { stegaClean } from '@sanity/client/stega';

export interface SiteSettingsForSD {
  siteName?: string;
  siteDescription?: string;
  logo?: string;
}

export interface BlogPostForSD {
  title: string;
  description?: string;
  slug: string;
  publishedAt?: string;
  updatedAt?: string;
  authorName?: string;
  image?: string;
}

/** Strip stega encoding from a string value if present. */
function clean(value: string): string;
function clean(value: string | undefined): string | undefined;
function clean(value: string | undefined): string | undefined {
  return value != null ? stegaClean(value) : undefined;
}

export function buildOrganization(
  settings: SiteSettingsForSD,
  siteUrl: string
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: clean(settings.siteName) ?? 'Gather Ground',
    url: siteUrl,
    ...(settings.logo ? { logo: settings.logo } : {}),
    ...(settings.siteDescription
      ? { description: clean(settings.siteDescription) }
      : {}),
  };
}

export function buildWebPage(props: {
  title: string;
  description?: string;
  url: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: clean(props.title),
    url: props.url,
    ...(props.description ? { description: clean(props.description) } : {}),
  };
}

export function buildBlogPosting(post: BlogPostForSD, siteUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: clean(post.title),
    url: `${siteUrl}/blog/${clean(post.slug)}`,
    ...(post.description ? { description: clean(post.description) } : {}),
    ...(post.publishedAt ? { datePublished: post.publishedAt } : {}),
    ...(post.updatedAt ? { dateModified: post.updatedAt } : {}),
    ...(post.authorName
      ? { author: { '@type': 'Person', name: clean(post.authorName) } }
      : {}),
    ...(post.image ? { image: post.image } : {}),
  };
}

export default null;
