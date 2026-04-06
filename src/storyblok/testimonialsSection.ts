/**
 * Storyblok component schema for TestimonialsSection.
 *
 * Push to Storyblok via the CLI:
 *   npx storyblok push-components --space 289911665285843
 */
export const testimonialsSectionSchema = {
  name: 'testimonials_section',
  display_name: 'Testimonials Section',
  is_root: false,
  is_nestable: true,
  schema: {
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
    testimonials: {
      type: 'multiasset',
      display_name: 'Testimonials',
      allow_target_types: ['story'],
      filter_content_type: ['testimonial'],
    },
  },
};

export default null;
