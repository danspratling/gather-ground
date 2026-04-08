/**
 * Storyblok nestable blok schema for the Post Header.
 *
 * Used in blog/[slug].astro to drive the header section of a blog post.
 * Fields map 1:1 to PostHeaderProps (snake_case → camelCase).
 *
 * Push to Storyblok via:
 *   npm run sync-schemas
 */
export const postHeaderSchema = {
  name: 'post_header',
  display_name: 'Post Header',
  is_root: false,
  is_nestable: true,
  schema: {
    published_date: {
      type: 'text',
      display_name: 'Published date',
      required: true,
      description: 'Displayed as-is (e.g. "Published 12 Mar 2026").',
    },
    title: {
      type: 'text',
      display_name: 'Title',
      required: true,
    },
    excerpt: {
      type: 'textarea',
      display_name: 'Excerpt',
      required: true,
    },
    categories: {
      type: 'options',
      display_name: 'Categories',
      description: 'e.g. Design, Research, Farming',
    },
    hero_image: {
      type: 'asset',
      display_name: 'Hero image',
      required: true,
      filetypes: ['images'],
    },
    body: {
      type: 'richtext',
      display_name: 'Body',
      required: true,
      description:
        'Full article body. Supports headings, blockquotes, lists, inline images, and callout blocks.',
    },
    author_name: {
      type: 'text',
      display_name: 'Author name',
      required: true,
    },
    author_avatar: {
      type: 'asset',
      display_name: 'Author avatar',
      required: true,
      filetypes: ['images'],
    },
    author_role: {
      type: 'text',
      display_name: 'Author role / title',
    },
  },
} as const;

export default null;
