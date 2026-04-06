import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import type {
  BlogGridProps,
  BlogGridPost,
} from '@/components/BlogGrid/BlogGrid.types';
import type { FilterChangeDetail } from '@/components/BlogFilters/BlogFilters';
import { FILTER_CHANGE_EVENT } from '@/components/BlogFilters/BlogFilters';

const POSTS_PER_PAGE = 6;

function BlogCard({ post }: { post: BlogGridPost }) {
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
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <img
            src={post.authorImage}
            alt={post.authorImageAlt}
            className="size-6 rounded-full object-cover"
          />
          <span>
            {post.authorName} &bull; {post.date}
          </span>
        </div>
        <h3 className="text-base font-semibold text-gray-900">
          <a href={post.href} className="hover:underline">
            {post.title}
          </a>
        </h3>
        <p className="line-clamp-2 text-sm font-normal text-gray-600">
          {post.excerpt}
        </p>
        {post.categories.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {post.categories.map((cat) => (
              <span
                key={cat}
                className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700"
              >
                {cat}
              </span>
            ))}
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
            <BlogCard key={post.slug} post={post} />
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
