/**
 * Storyblok component schema for Badge.
 *
 * Push to Storyblok via the CLI:
 *   npx storyblok push-components --space 289911665285843
 */
export const badgeSchema = {
  name: 'badge',
  display_name: 'Badge',
  is_root: false,
  is_nestable: true,
  schema: {
    label: {
      type: 'text',
      display_name: 'Label',
      required: true,
    },
    type: {
      type: 'option',
      display_name: 'Type',
      default_value: 'pill',
      options: [
        { value: 'pill', name: 'Pill' },
        { value: 'badge-modern', name: 'Badge modern' },
      ],
    },
    color: {
      type: 'option',
      display_name: 'Color',
      default_value: 'gray',
      options: [
        { value: 'gray', name: 'Gray' },
        { value: 'brand', name: 'Brand' },
        { value: 'error', name: 'Error' },
        { value: 'warning', name: 'Warning' },
        { value: 'success', name: 'Success' },
        { value: 'blue-light', name: 'Blue light' },
        { value: 'blue', name: 'Blue' },
        { value: 'indigo', name: 'Indigo' },
        { value: 'purple', name: 'Purple' },
        { value: 'pink', name: 'Pink' },
        { value: 'orange', name: 'Orange' },
        { value: 'gray-blue', name: 'Gray blue' },
      ],
    },
    size: {
      type: 'option',
      display_name: 'Size',
      default_value: 'sm',
      options: [
        { value: 'sm', name: 'Small' },
        { value: 'md', name: 'Medium' },
        { value: 'lg', name: 'Large' },
      ],
    },
    dot: {
      type: 'boolean',
      display_name: 'Show dot',
      default_value: false,
    },
  },
} as const;
