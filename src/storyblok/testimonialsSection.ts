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
      type: 'bloks',
      display_name: 'Testimonials',
      restrict_components: true,
      component_whitelist: ['testimonial_card'],
    },
  },
};

export default null;
