import { useState, useEffect } from 'react';
import type {
  BlogGridProps,
  BlogGridPost,
} from '@/components/BlogGrid/BlogGrid.types';
import type { FilterChangeDetail } from '@/components/BlogFilters/BlogFilters';
import { FILTER_CHANGE_EVENT } from '@/components/BlogFilters/BlogFilters';
import BlogCard from '@/components/BlogCard/BlogCard';

const POSTS_PER_PAGE = 6;

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
              variant="index"
              {...post}
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
