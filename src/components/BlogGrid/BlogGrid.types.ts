export interface BlogGridPost {
  image: string;
  imageAlt: string;
  title: string;
  excerpt: string;
  date: string;
  authorName: string;
  authorImage: string;
  authorImageAlt: string;
  href: string;
  slug: string;
  categories: string[];
}

export interface BlogGridProps {
  posts: BlogGridPost[];
  initialVisibleCount?: number;
}

export default null;
