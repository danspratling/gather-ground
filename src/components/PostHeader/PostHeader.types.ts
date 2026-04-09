import type { StoryblokRichTextDocumentNode } from '@storyblok/astro';

export interface PostHeaderProps {
  publishedDate: string;
  title: string;
  excerpt: string;
  categories?: string[];
  heroImage: string;
  heroImageAlt: string;
  body: StoryblokRichTextDocumentNode;
  authorName: string;
  authorAvatar: string;
  authorAvatarAlt: string;
  authorRole: string;
}

export default null;
