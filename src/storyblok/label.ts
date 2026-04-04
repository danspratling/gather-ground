/**
 * Storyblok component schema for Label.
 *
 * Push to Storyblok via the CLI:
 *   npx storyblok push-components --space 289911665285843
 */
export const labelSchema = {
  name: 'label',
  display_name: 'Label',
  is_root: false,
  is_nestable: true,
  schema: {
    text: {
      type: 'text',
      display_name: 'Text',
      required: true,
    },
    size: {
      type: 'option',
      display_name: 'Size',
      default_value: 'md',
      options: [
        { value: 'sm', name: 'SM (14px)' },
        { value: 'md', name: 'MD (16px)' },
      ],
    },
    color: {
      type: 'text',
      display_name: 'Color',
      description: 'CSS color value (e.g. #a5a5a5). Leave blank to inherit.',
    },
  },
} as const;
