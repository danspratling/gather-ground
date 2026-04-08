import type { BadgeColor } from '@/components/Badge/Badge.types';

export interface BlogFiltersProps {
  categories: string[];
  initialCategory?: string | null;
  initialSearch?: string;
  categoryColors?: Record<string, BadgeColor>;
}

export default null;
