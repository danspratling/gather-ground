import { cn } from '@/lib/utils';
import type { BlogCardProps } from '@/components/BlogCard/BlogCard.types';

// Mirrors the pill colour palette from Badge.astro for use inside React islands.
const pillColorClasses: Record<string, string> = {
  gray: 'bg-off-white border-gray-200 text-brand-700',
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

export default function BlogCard({
  variant = 'homepage',
  image,
  imageAlt,
  title,
  excerpt,
  date,
  authorName,
  authorImage,
  authorImageAlt,
  href,
  categories,
  categoryColorMap,
  class: className,
}: BlogCardProps) {
  return (
    <article
      className={cn(
        'group relative -m-3 flex flex-col gap-4 rounded-2xl p-3 transition-colors hover:bg-muted',
        className
      )}
    >
      <div className="overflow-hidden rounded-xl">
        <img
          src={image}
          alt={imageAlt}
          className={cn(
            'w-full object-cover transition-transform duration-300 group-hover:scale-105',
            variant === 'homepage' ? 'h-56' : 'h-48'
          )}
          width={600}
          height={variant === 'homepage' ? 224 : 192}
          loading="lazy"
          decoding="async"
        />
      </div>
      <div className="flex flex-col gap-3">
        {variant === 'homepage' && authorImage ? (
          <div className="flex items-center gap-3">
            <img
              src={authorImage}
              alt={authorImageAlt ?? authorName}
              className="size-8 rounded-full object-cover"
              width={32}
              height={32}
              loading="lazy"
              decoding="async"
            />
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-brand-700">
                {authorName}
              </span>
              <time className="text-sm font-normal text-brand-500">{date}</time>
            </div>
          </div>
        ) : (
          <p className="text-sm text-brand-600">
            {authorName}
            <span className="mx-1.5 text-brand-400">&bull;</span>
            <time>{date}</time>
          </p>
        )}
        <h3
          className={cn(
            'font-semibold text-brand-900',
            variant === 'homepage' ? 'text-lg' : 'text-base'
          )}
        >
          <a href={href} className="after:absolute after:inset-0">
            {title}
          </a>
        </h3>
        <p className="line-clamp-3 text-sm font-normal text-brand-600">
          {excerpt}
        </p>
        {categories && categories.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {categories.map((cat) => {
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
