import { useState } from 'react';
import { Search01 } from '@untitledui-pro/icons/line';
import { cn } from '@/lib/utils';
import type { BlogFiltersProps } from '@/components/BlogFilters/BlogFilters.types';

export const FILTER_CHANGE_EVENT = 'blog-filter-change';

export interface FilterChangeDetail {
  category: string | null;
  search: string;
}

export default function BlogFilters({
  categories,
  initialCategory = null,
  initialSearch = '',
}: BlogFiltersProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(
    initialCategory
  );
  const [searchTerm, setSearchTerm] = useState(initialSearch);

  const dispatch = (category: string | null, search: string) => {
    const params = new URLSearchParams();
    if (category) params.set('category', category);
    if (search) params.set('search', search);
    const qs = params.toString();
    window.history.replaceState(
      null,
      '',
      qs ? `?${qs}` : window.location.pathname
    );
    window.dispatchEvent(
      new CustomEvent<FilterChangeDetail>(FILTER_CHANGE_EVENT, {
        detail: { category, search },
      })
    );
  };

  const handleCategoryClick = (cat: string | null) => {
    setActiveCategory(cat);
    dispatch(cat, searchTerm);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    dispatch(activeCategory, e.target.value);
  };

  const tabs = [
    { label: 'View all', value: null },
    ...categories.map((c) => ({ label: c, value: c })),
  ];

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div
        className="flex gap-2 overflow-x-auto pb-1 md:pb-0"
        role="group"
        aria-label="Filter by category"
      >
        {tabs.map(({ label, value }) => (
          <button
            key={value ?? 'all'}
            type="button"
            aria-pressed={activeCategory === value}
            onClick={() => handleCategoryClick(value)}
            className={cn(
              'inline-flex shrink-0 items-center rounded-full px-4 py-2 text-sm font-semibold whitespace-nowrap transition-colors',
              activeCategory === value
                ? 'bg-brand-700 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            )}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="relative md:w-64">
        <Search01
          className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-gray-400"
          aria-hidden="true"
        />
        <input
          type="search"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search articles…"
          aria-label="Search articles"
          className="w-full rounded-full border border-gray-300 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-900 placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400"
        />
      </div>
    </div>
  );
}
