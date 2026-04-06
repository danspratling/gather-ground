/**
 * Storyblok component schema for TestimonialCard.
 *
 * Push to Storyblok via the CLI:
 *   npx storyblok push-components --space 289911665285843
 */
export const testimonialCardSchema = {
  name: 'testimonial_card',
  display_name: 'Testimonial Card',
  is_root: false,
  is_nestable: true,
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
