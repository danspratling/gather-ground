/**
 * Storyblok component schemas for CallToAction variants.
 *
 * Push to Storyblok via the CLI:
 *   npx storyblok push-components --space 289911665285843
 */
export const callToActionSchema = {
  name: 'call_to_action_simple_centered',
  display_name: 'CTA — Simple Centered',
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
      minimum: 1,
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
