import type { BlogGridPost } from '@/components/BlogGrid/BlogGrid.types';

export interface PaginatedBlogPostsProps {
  posts: BlogGridPost[];
  initialVisibleCount?: number;
  initialCategory?: string | null;
  initialSearch?: string;
}

export default null;
