import type { BlogCardProps } from '@/components/BlogCard/BlogCard.types';

export interface BlogSectionPost extends Pick<
  BlogCardProps,
  | 'image'
  | 'imageAlt'
  | 'title'
  | 'excerpt'
  | 'date'
  | 'authorName'
  | 'authorImage'
  | 'authorImageAlt'
  | 'href'
> {}

export interface BlogSectionProps {
  eyebrow: string;
  heading: string;
  subCopy: string;
  viewAllHref: string;
  viewAllLabel?: string;
  posts: BlogSectionPost[];
}

export default null;
