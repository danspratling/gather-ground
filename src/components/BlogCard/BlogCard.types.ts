import type { BadgeColor } from '@/components/Badge/Badge.types';

export type BlogCardVariant = 'homepage' | 'index';

export interface BlogCardProps {
  variant?: BlogCardVariant;
  image: string;
  imageAlt: string;
  title: string;
  excerpt: string;
  date: string;
  authorName: string;
  authorImage?: string;
  authorImageAlt?: string;
  href: string;
  categories?: string[];
  categoryColorMap?: Record<string, BadgeColor>;
  class?: string;
}

export default null;
