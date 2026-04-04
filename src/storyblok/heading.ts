/**
 * Storyblok component schema for Heading.
 *
 * Push to Storyblok via the CLI:
 *   npx storyblok push-components --space 289911665285843
 */
export const headingSchema = {
  name: 'heading',
  display_name: 'Heading',
  is_root: false,
  is_nestable: true,
  schema: {
    text: {
      type: 'text',
      display_name: 'Text',
      required: true,
    },
    as: {
      type: 'option',
      display_name: 'Tag',
      default_value: 'h2',
      options: [
        { value: 'h1', name: 'H1' },
        { value: 'h2', name: 'H2' },
        { value: 'h3', name: 'H3' },
        { value: 'h4', name: 'H4' },
        { value: 'h5', name: 'H5' },
        { value: 'h6', name: 'H6' },
      ],
    },
    size: {
      type: 'option',
      display_name: 'Size',
      default_value: 'display-md',
      options: [
        { value: 'display-xl', name: 'Display XL (60px)' },
        { value: 'display-md', name: 'Display MD (36px)' },
        { value: 'text-xl', name: 'Text XL (20px)' },
        { value: 'text-lg', name: 'Text LG (18px)' },
      ],
    },
    weight: {
      type: 'option',
      display_name: 'Weight',
      default_value: 'semibold',
      options: [
        { value: 'medium', name: 'Medium (500)' },
        { value: 'semibold', name: 'Semibold (600)' },
      ],
    },
    color: {
      type: 'text',
      display_name: 'Color',
      description: 'CSS color value (e.g. #a5a5a5). Leave blank to inherit.',
    },
  },
} as const;
