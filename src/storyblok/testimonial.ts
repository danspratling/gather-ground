/**
 * Storyblok content type schema for a single Testimonial.
 *
 * Stored as standalone stories (is_root: true) so they can be reused
 * across multiple sections. Referenced via the References field on
 * testimonials_section.
 *
 * Push to Storyblok via the CLI:
 *   npm run sync-schemas
 */
export const testimonialSchema = {
  name: 'testimonial',
  display_name: 'Testimonial',
  is_root: true,
  is_nestable: false,
  schema: {
    quote: {
      type: 'textarea',
      display_name: 'Quote',
      required: true,
    },
    platform: {
      type: 'option',
      display_name: 'Platform',
      options: [
        { value: 'twitter', name: 'Twitter / X' },
        { value: 'instagram', name: 'Instagram' },
        { value: 'facebook', name: 'Facebook' },
        { value: 'tiktok', name: 'TikTok' },
        { value: 'linkedin', name: 'LinkedIn' },
      ],
    },
    author_src: {
      type: 'asset',
      display_name: 'Author image',
      required: true,
    },
    author_name: {
      type: 'text',
      display_name: 'Author name',
      required: true,
    },
    author_secondary: {
      type: 'text',
      display_name: 'Author secondary text',
      description: 'Handle, date, or subtitle.',
    },
    author_secondary_is_handle: {
      type: 'boolean',
      display_name: 'Secondary is handle',
      default_value: false,
    },
  },
} as const;

export default null;
