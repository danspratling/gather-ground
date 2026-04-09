/**
 * Storyblok component schema for CtaSplitImage.
 *
 * Push to Storyblok via the CLI:
 *   npx storyblok push-components --space 289911665285843
 */
export const ctaSplitImageSchema = {
  name: 'cta_split_image',
  display_name: 'CTA — Split Image',
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
    image: {
      type: 'asset',
      display_name: 'Image',
      required: true,
      filetypes: ['images'],
    },
  },
};

export default null;
