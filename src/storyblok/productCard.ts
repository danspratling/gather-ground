/**
 * Storyblok component schema for ProductCard.
 *
 * Push to Storyblok via the CLI:
 *   npx storyblok push-components --space 289911665285843
 */
export const productCardSchema = {
  name: 'product_card',
  display_name: 'Product Card',
  is_root: false,
  is_nestable: true,
  schema: {
    image: {
      type: 'asset',
      display_name: 'Image',
      required: true,
    },
    title: {
      type: 'text',
      display_name: 'Title',
      required: true,
    },
    description: {
      type: 'text',
      display_name: 'Description',
      description: 'Only shown in the category variant.',
    },
    href: {
      type: 'multilink',
      display_name: 'Link URL',
      required: true,
    },
  },
} as const;
