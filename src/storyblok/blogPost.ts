/**
 * Storyblok content type schema for a Blog Post.
 *
 * Stored as standalone stories (is_root: true) so they can be referenced
 * from blog_section and used as full post pages. Referenced via the
 * References field on blog_section.
 *
 * Push to Storyblok via the CLI:
 *   npm run sync-schemas
 */
export const blogPostSchema = {
  name: 'blog_post',
  display_name: 'Blog Post',
  is_root: true,
  is_nestable: false,
  schema: {
    image: {
      type: 'asset',
      display_name: 'Cover image',
      required: true,
      filetypes: ['images'],
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
      description: 'e.g. Design, Product, Software Development',
    },
    body: {
      type: 'richtext',
      display_name: 'Body',
      required: true,
      description:
        'Full article body. Supports headings, blockquotes, lists, inline images, and callout blocks.',
      allow_target_types: ['blok'],
      component_whitelist: ['callout'],
    },
  },
} as const;

export default null;
