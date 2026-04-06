/**
 * Storyblok component schema for HeroSection.
 *
 * Push to Storyblok via the CLI:
 *   npx storyblok push-components --space 289911665285843
 */
export const heroSectionSchema = {
  name: 'hero_section',
  display_name: 'Hero Section',
  is_root: false,
  is_nestable: true,
  schema: {
    headline: {
      type: 'text',
      display_name: 'Headline',
      required: true,
    },
    sub_copy: {
      type: 'textarea',
      display_name: 'Sub-copy',
      required: true,
    },
    primary_cta_label: {
      type: 'text',
      display_name: 'Primary CTA label',
      required: true,
      default_value: 'Our Products',
    },
    primary_cta_href: {
      type: 'multilink',
      display_name: 'Primary CTA URL',
      required: true,
    },
    secondary_cta_label: {
      type: 'text',
      display_name: 'Secondary CTA label',
      default_value: 'Get in touch',
    },
    secondary_cta_href: {
      type: 'multilink',
      display_name: 'Secondary CTA URL',
    },
    image: {
      type: 'asset',
      display_name: 'Hero image',
      filetypes: ['images'],
    },
  },
};

export default null;
