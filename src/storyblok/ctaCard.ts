/**
 * Storyblok component schema for CtaCard.
 *
 * Push to Storyblok via the CLI:
 *   npx storyblok push-components --space 289911665285843
 */
export const ctaCardSchema = {
  name: 'cta_card',
  display_name: 'CTA — Card',
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
    layout: {
      type: 'option',
      display_name: 'Layout',
      default_value: 'horizontal',
      options: [
        { value: 'horizontal', name: 'Horizontal' },
        { value: 'vertical', name: 'Vertical' },
      ],
    },
  },
};

export default null;
