import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { loadQuery } from '@/lib/sanity';
import { allBlogPostsQuery, siteSettingsQuery } from '@/lib/queries';

interface BlogPostRSS {
  title: string;
  slug: string;
  excerpt: string;
  publishedAt?: string;
}

interface SiteSettingsRSS {
  siteName?: string;
  siteDescription?: string;
}

export async function GET(context: APIContext) {
  const { data: posts } = await loadQuery<BlogPostRSS[]>({
    query: allBlogPostsQuery,
  });

  const { data: settings } = await loadQuery<SiteSettingsRSS | null>({
    query: siteSettingsQuery,
  });

  const siteUrl = context.site ?? new URL(context.url.origin);

  return rss({
    title: settings?.siteName ?? 'Gather Ground',
    description:
      settings?.siteDescription ??
      'Family farm in rural Iowa — heritage breeds, seasonal produce, and sustainable farming.',
    site: siteUrl.toString(),
    items: (posts ?? []).map((post) => ({
      title: post.title,
      description: post.excerpt,
      pubDate: post.publishedAt ? new Date(post.publishedAt) : undefined,
      link: `/blog/${post.slug}`,
    })),
  });
}
