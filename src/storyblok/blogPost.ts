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
    date: {
      type: 'text',
      display_name: 'Publish date',
      required: true,
      description: 'Displayed as-is (e.g. "12 Mar 2026").',
    },
    author_name: {
      type: 'text',
      display_name: 'Author name',
      required: true,
    },
    author_image: {
      type: 'asset',
      display_name: 'Author photo',
      required: true,
      filetypes: ['images'],
    },
    categories: {
      type: 'options',
      display_name: 'Categories',
      description: 'e.g. Design, Product, Software Development',
    },
  },
} as const;

export default null;
