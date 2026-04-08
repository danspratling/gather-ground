/**
 * Storyblok nestable blok schema for the Featured Post component.
 *
 * Represents a single featured blog post on the blog listing page.
 * Push to Storyblok via:
 *   npm run sync-schemas
 */
export const featuredPostSchema = {
  name: 'featured_post',
  display_name: 'Featured Post',
  is_root: false,
  is_nestable: true,
  schema: {
    image: {
      type: 'asset',
      display_name: 'Image',
      required: true,
      filetypes: ['images'],
    },
    categories: {
      type: 'array',
      display_name: 'Categories',
      description: 'e.g. Design, Product',
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
    href: {
      type: 'text',
      display_name: 'Link URL',
      required: true,
    },
    author_name: {
      type: 'text',
      display_name: 'Author name',
      required: true,
    },
    author_avatar: {
      type: 'asset',
      display_name: 'Author photo',
      required: true,
      filetypes: ['images'],
    },
    date: {
      type: 'text',
      display_name: 'Publish date',
      required: true,
      description: 'Displayed as-is (e.g. "12 Mar 2026").',
    },
  },
} as const;

export default null;
