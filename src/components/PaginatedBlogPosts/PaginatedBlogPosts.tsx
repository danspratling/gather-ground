import { useMemo } from 'react';
import BlogFilters from '@/components/BlogFilters/BlogFilters';
import BlogGrid from '@/components/BlogGrid/BlogGrid';
import type { BadgeColor } from '@/components/Badge/Badge.types';
import type { PaginatedBlogPostsProps } from '@/components/PaginatedBlogPosts/PaginatedBlogPosts.types';

// Palette of distinct badge colors assigned round-robin to categories.
// Ordered for good visual variety — avoids gray/brand which are used elsewhere.
const CATEGORY_PALETTE: BadgeColor[] = [
  'blue',
  'purple',
  'orange',
  'success',
  'pink',
  'indigo',
  'error',
  'gray-blue',
  'blue-light',
  'warning',
];

export default function PaginatedBlogPosts({
  posts,
  initialVisibleCount,
  initialCategory = null,
  initialSearch = '',
}: PaginatedBlogPostsProps) {
  const { categories, categoryColorMap } = useMemo(() => {
    const unique = [...new Set(posts.flatMap((p) => p.categories))].sort();
    const colorMap: Record<string, BadgeColor> = Object.fromEntries(
      unique.map((cat, i) => [
        cat,
        CATEGORY_PALETTE[i % CATEGORY_PALETTE.length],
      ])
    );
    return { categories: unique, categoryColorMap: colorMap };
  }, [posts]);

  return (
    <div className="flex flex-col gap-8">
      <BlogFilters
        categories={categories}
        initialCategory={initialCategory}
        initialSearch={initialSearch}
        categoryColors={categoryColorMap}
      />
      <BlogGrid
        posts={posts}
        initialVisibleCount={initialVisibleCount}
        categoryColorMap={categoryColorMap}
      />
    </div>
  );
}
