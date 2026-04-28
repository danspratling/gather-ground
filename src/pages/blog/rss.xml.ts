import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { stegaClean } from '@sanity/client/stega';
import { loadQuery } from '@/lib/sanity';
import { siteSettingsQuery } from '@/lib/queries';

const rssBlogPostsQuery = `*[_type == "blogPosts" && defined(slug.current) && defined(publishedAt)] | order(publishedAt desc){
  title,
  "slug": slug.current,
  excerpt,
  publishedAt
}`;

interface BlogPostRSS {
  title: string;
  slug: string;
  excerpt: string;
  publishedAt: string;
}

interface SiteSettingsRSS {
  siteName?: string;
  siteDescription?: string;
}

export async function GET(context: APIContext) {
  const { data: posts } = await loadQuery<BlogPostRSS[]>({
    query: rssBlogPostsQuery,
  });

  const { data: settings } = await loadQuery<SiteSettingsRSS | null>({
    query: siteSettingsQuery,
  });

  const siteUrl = context.site ?? new URL(context.url.origin);

  return rss({
    title: stegaClean(settings?.siteName ?? 'Gather Ground'),
    description: stegaClean(
      settings?.siteDescription ??
        'Family farm in rural Iowa — heritage breeds, seasonal produce, and sustainable farming.'
    ),
    site: siteUrl.toString(),
    items: (posts ?? []).map((post) => ({
      title: stegaClean(post.title),
      description: stegaClean(post.excerpt),
      pubDate: new Date(post.publishedAt),
      link: `/blog/${stegaClean(post.slug)}`,
    })),
  });
}
