/**
 * Storyblok component schema for ProductsSection.
 *
 * Push to Storyblok via the CLI:
 *   npx storyblok push-components --space 289911665285843
 */
export const productsSectionSchema = {
  name: 'products_section',
  display_name: 'Products Section',
  is_root: false,
  is_nestable: true,
  schema: {
    variant: {
      type: 'option',
      display_name: 'Variant',
      required: true,
      default_value: 'cards',
      options: [
        { value: 'cards', name: 'Category Cards' },
        { value: 'carousel', name: 'Image Carousel' },
      ],
    },
    eyebrow: {
      type: 'text',
      display_name: 'Eyebrow',
      required: true,
      default_value: 'Products',
    },
    heading: {
      type: 'text',
      display_name: 'Heading',
      required: true,
    },
    sub_copy: {
      type: 'textarea',
      display_name: 'Sub-copy',
      required: true,
    },
    products: {
      type: 'bloks',
      display_name: 'Products',
      restrict_components: true,
      component_whitelist: ['product_card'],
    },
  },
};

export default null;
