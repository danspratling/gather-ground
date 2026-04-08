import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import type {
  BlogGridProps,
  BlogGridPost,
} from '@/components/BlogGrid/BlogGrid.types';
import type { BadgeColor } from '@/components/Badge/Badge.types';
import type { FilterChangeDetail } from '@/components/BlogFilters/BlogFilters';
import { FILTER_CHANGE_EVENT } from '@/components/BlogFilters/BlogFilters';

const POSTS_PER_PAGE = 6;

// Mirrors the pill colour palette from Badge.astro so we can render
// coloured category chips inline inside this React island.
const pillColorClasses: Record<string, string> = {
  gray: 'bg-off-white border-gray-200 text-brand-400',
  brand: 'bg-off-white border-brand-50 text-brand-700',
  error: 'bg-error-50 border-error-200 text-error-700',
  warning: 'bg-warning-50 border-warning-200 text-warning-700',
  success: 'bg-success-50 border-success-200 text-success-700',
  'blue-light': 'bg-blue-light-50 border-blue-light-200 text-blue-light-700',
  blue: 'bg-blue-50 border-blue-200 text-blue-700',
  indigo: 'bg-indigo-50 border-indigo-200 text-indigo-700',
  purple: 'bg-purple-50 border-purple-200 text-purple-700',
  pink: 'bg-pink-50 border-pink-200 text-pink-700',
  orange: 'bg-orange-50 border-orange-200 text-orange-700',
  'gray-blue': 'bg-gray-blue-50 border-gray-blue-200 text-gray-blue-700',
};

function BlogCard({
  post,
  categoryColorMap,
}: {
  post: BlogGridPost;
  categoryColorMap?: Record<string, BadgeColor>;
}) {
  return (
    <article className="flex flex-col gap-4">
      <a href={post.href} className="block overflow-hidden rounded-xl">
        <img
          src={post.image}
          alt={post.imageAlt}
          className="h-48 w-full object-cover transition-transform duration-300 hover:scale-105"
          loading="lazy"
        />
      </a>
      <div className="flex flex-col gap-3">
        <p className="text-sm text-brand-600">
          {post.authorName}
          <span className="mx-1.5 text-brand-400">&bull;</span>
          <time>{post.date}</time>
        </p>
        <h3 className="text-base font-semibold text-brand-900">
          <a href={post.href} className="hover:underline">
            {post.title}
          </a>
        </h3>
        <p className="line-clamp-2 text-sm font-normal text-brand-600">
          {post.excerpt}
        </p>
        {post.categories.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {post.categories.map((cat) => {
              const color = categoryColorMap?.[cat] ?? 'gray';
              return (
                <span
                  key={cat}
                  className={cn(
                    'inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium',
                    pillColorClasses[color] ?? pillColorClasses.gray
                  )}
                >
                  {cat}
                </span>
              );
            })}
          </div>
        )}
      </div>
    </article>
  );
}

function filterPosts(
  posts: BlogGridPost[],
  category: string | null,
  search: string
): BlogGridPost[] {
  const term = search.toLowerCase().trim();
  return posts.filter((post) => {
    const matchesCategory =
      category === null || post.categories.includes(category);
    const matchesSearch =
      term === '' ||
      post.title.toLowerCase().includes(term) ||
      post.excerpt.toLowerCase().includes(term) ||
      post.slug.toLowerCase().includes(term) ||
      post.authorName.toLowerCase().includes(term);
    return matchesCategory && matchesSearch;
  });
}

export default function BlogGrid({
  posts,
  initialVisibleCount = POSTS_PER_PAGE,
  categoryColorMap,
}: BlogGridProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [visibleCount, setVisibleCount] = useState(initialVisibleCount);

  useEffect(() => {
    // Reset visible count whenever filters change
    setVisibleCount(initialVisibleCount);
  }, [activeCategory, searchTerm, initialVisibleCount]);

  useEffect(() => {
    const handler = (e: Event) => {
      const { category, search } = (e as CustomEvent<FilterChangeDetail>)
        .detail;
      setActiveCategory(category);
      setSearchTerm(search);
    };
    window.addEventListener(FILTER_CHANGE_EVENT, handler);
    return () => window.removeEventListener(FILTER_CHANGE_EVENT, handler);
  }, []);

  const filtered = filterPosts(posts, activeCategory, searchTerm);
  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  return (
    <div className="flex flex-col gap-12">
      {visible.length > 0 ? (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {visible.map((post) => (
            <BlogCard
              key={post.slug}
              post={post}
              categoryColorMap={categoryColorMap}
            />
          ))}
        </div>
      ) : (
        <p className="py-16 text-center text-base text-gray-500">
          No posts match your search. Try a different term or category.
        </p>
      )}
      {hasMore && (
        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => setVisibleCount((n) => n + POSTS_PER_PAGE)}
            className="rounded-full border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400"
          >
            Load more
          </button>
        </div>
      )}
    </div>
  );
}
