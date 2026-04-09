/**
 * Storyblok component schema for DetailsTitle.
 *
 * Push to Storyblok via the CLI:
 *   npx storyblok push-components --space 289911665285843
 */
export const detailsTitleSchema = {
  name: 'details_title',
  display_name: 'Details — Title',
  is_root: false,
  is_nestable: true,
  schema: {
    eyebrow: {
      type: 'text',
      display_name: 'Eyebrow',
      required: true,
    },
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
    align: {
      type: 'option',
      display_name: 'Alignment',
      default_value: 'left',
      options: [
        { value: 'left', name: 'Left' },
        { value: 'center', name: 'Center' },
      ],
    },
    dark: {
      type: 'boolean',
      display_name: 'Dark variant',
      default_value: false,
    },
  },
};

export default null;
