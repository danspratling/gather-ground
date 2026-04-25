import type { PortableTextBlock } from '@portabletext/types';

export interface PostHeaderProps {
  publishedDate: string;
  title: string;
  excerpt: string;
  categories?: string[];
  heroImage: string;
  heroImageAlt: string;
  body: PortableTextBlock[];
  authorName: string;
  authorAvatar: string;
  authorAvatarAlt: string;
  authorRole: string;
}

export default null;
