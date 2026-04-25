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

export function buildOrganization(
  settings: SiteSettingsForSD,
  siteUrl: string
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: settings.siteName ?? 'Gather Ground',
    url: siteUrl,
    ...(settings.logo ? { logo: settings.logo } : {}),
    ...(settings.siteDescription
      ? { description: settings.siteDescription }
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
    name: props.title,
    url: props.url,
    ...(props.description ? { description: props.description } : {}),
  };
}

export function buildBlogPosting(post: BlogPostForSD, siteUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    url: `${siteUrl}/blog/${post.slug}`,
    ...(post.description ? { description: post.description } : {}),
    ...(post.publishedAt ? { datePublished: post.publishedAt } : {}),
    ...(post.updatedAt ? { dateModified: post.updatedAt } : {}),
    ...(post.authorName
      ? { author: { '@type': 'Person', name: post.authorName } }
      : {}),
    ...(post.image ? { image: post.image } : {}),
  };
}

export default null;
