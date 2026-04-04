export type BlogCardVariant = 'homepage' | 'index';

export interface BlogCardProps {
  variant?: BlogCardVariant;
  image: string;
  imageAlt: string;
  title: string;
  excerpt: string;
  date: string;
  authorName: string;
  authorImage: string;
  authorImageAlt: string;
  href: string;
  class?: string;
}
