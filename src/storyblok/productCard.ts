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
    variant: {
      type: 'option',
      display_name: 'Variant',
      required: true,
      default_value: 'category',
      options: [
        { value: 'category', name: 'Category (image + title + description)' },
        { value: 'image-link', name: 'Image link (large image + title overlay)' },
      ],
    },
    image: {
      type: 'asset',
      display_name: 'Image',
      required: true,
    },
    image_alt: {
      type: 'text',
      display_name: 'Image alt text',
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
      type: 'text',
      display_name: 'Link URL',
      required: true,
    },
  },
} as const;
