/**
 * Storyblok component schemas for ProductsSection (cards + carousel variants).
 *
 * Push to Storyblok via the CLI:
 *   npx storyblok push-components --space 289911665285843
 */
export const productsSectionCardsSchema = {
  name: 'products_section_cards',
  display_name: 'Products Section — Category Cards',
  is_root: false,
  is_nestable: true,
  schema: {
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

export const productsSectionCarouselSchema = {
  name: 'products_section_carousel',
  display_name: 'Products Section — Image Carousel',
  is_root: false,
  is_nestable: true,
  schema: {
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
