/**
 * Storyblok component schema for CtaSimpleLeft.
 *
 * Push to Storyblok via the CLI:
 *   npx storyblok push-components --space 289911665285843
 */
export const ctaSimpleLeftSchema = {
  name: 'cta_simple_left',
  display_name: 'CTA — Simple Left',
  is_root: false,
  is_nestable: true,
  schema: {
    heading: {
      type: 'text',
      display_name: 'Heading',
      required: true,
    },
    body: {
      type: 'textarea',
      display_name: 'Body',
      required: true,
    },
    primary_cta: {
      type: 'bloks',
      display_name: 'Primary CTA',
      restrict_components: true,
      component_whitelist: ['button'],
      maximum: 1,
    },
    secondary_cta: {
      type: 'bloks',
      display_name: 'Secondary CTA',
      restrict_components: true,
      component_whitelist: ['button'],
      maximum: 1,
    },
  },
};

export default null;
