/**
 * Storyblok component schema for Body.
 *
 * Push to Storyblok via the CLI:
 *   npx storyblok push-components --space 289911665285843
 */
export const bodySchema = {
  name: 'body',
  display_name: 'Body',
  is_root: false,
  is_nestable: true,
  schema: {
    text: {
      type: 'textarea',
      display_name: 'Text',
      required: true,
    },
    as: {
      type: 'option',
      display_name: 'Tag',
      default_value: 'p',
      options: [
        { value: 'p', name: 'Paragraph' },
        { value: 'span', name: 'Span (inline)' },
        { value: 'div', name: 'Div (block)' },
      ],
    },
    size: {
      type: 'option',
      display_name: 'Size',
      default_value: 'md',
      options: [
        { value: 'xl', name: 'XL (20px)' },
        { value: 'lg', name: 'LG (18px)' },
        { value: 'md', name: 'MD (16px)' },
        { value: 'sm', name: 'SM (14px)' },
        { value: 'xs', name: 'XS (12px)' },
      ],
    },
    weight: {
      type: 'option',
      display_name: 'Weight',
      default_value: 'regular',
      options: [
        { value: 'regular', name: 'Regular (400)' },
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
