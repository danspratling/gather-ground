/**
 * Storyblok component schema for Input.
 *
 * Push to Storyblok via the CLI:
 *   npx storyblok push-components --space 289911665285843
 */
export const inputSchema = {
  name: 'input',
  display_name: 'Input',
  is_root: false,
  is_nestable: true,
  schema: {
    name: {
      type: 'text',
      display_name: 'Field name',
      required: true,
      description: 'HTML name and id attribute for the input.',
    },
    label: {
      type: 'text',
      display_name: 'Label',
      description: 'Visible label shown above the input.',
    },
    required: {
      type: 'boolean',
      display_name: 'Required',
      default_value: false,
    },
    placeholder: {
      type: 'text',
      display_name: 'Placeholder',
    },
    type: {
      type: 'option',
      display_name: 'Type',
      default_value: 'text',
      options: [
        { value: 'text', name: 'Text' },
        { value: 'email', name: 'Email' },
        { value: 'tel', name: 'Phone' },
        { value: 'url', name: 'URL' },
        { value: 'password', name: 'Password' },
      ],
    },
    size: {
      type: 'option',
      display_name: 'Size',
      default_value: 'md',
      options: [
        { value: 'sm', name: 'Small' },
        { value: 'md', name: 'Medium' },
      ],
    },
    hint: {
      type: 'text',
      display_name: 'Hint text',
      description: 'Helper text shown below the input.',
    },
    error: {
      type: 'text',
      display_name: 'Error message',
      description: 'Validation error shown below the input.',
    },
    disabled: {
      type: 'boolean',
      display_name: 'Disabled',
      default_value: false,
    },
    icon_leading: {
      type: 'boolean',
      display_name: 'Leading icon',
      default_value: false,
      description: 'Shows a search icon on the left side of the input.',
    },
  },
} as const;
