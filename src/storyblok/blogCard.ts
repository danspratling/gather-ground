/**
 * Storyblok component schema for BlogCard.
 *
 * Push to Storyblok via the CLI:
 *   npx storyblok push-components --space 289911665285843
 */
export const blogCardSchema = {
  name: 'blog_card',
  display_name: 'Blog Card',
  is_root: false,
  is_nestable: true,
  schema: {
    variant: {
      type: 'option',
      display_name: 'Variant',
      default_value: 'homepage',
      options: [
        { value: 'homepage', name: 'Homepage (larger image)' },
        { value: 'index', name: 'Blog index (compact)' },
      ],
    },
    image: {
      type: 'asset',
      display_name: 'Cover image',
      required: true,
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
    },
    href: {
      type: 'multilink',
      display_name: 'Link URL',
      required: true,
    },
  },
} as const;
