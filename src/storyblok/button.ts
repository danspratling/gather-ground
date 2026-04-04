/**
 * Storyblok component schema for Button.
 *
 * Push to Storyblok via the CLI:
 *   npx storyblok push-components --space 289911665285843
 *
 * Field names are snake_case (Storyblok convention) and map 1-to-1
 * to the camelCase keys in src/types/button.ts.
 */
export const buttonSchema = {
  name: 'button',
  display_name: 'Button',
  is_root: false,
  is_nestable: true,
  schema: {
    label: {
      type: 'text',
      display_name: 'Label',
      required: true,
      default_value: 'Button CTA',
      description: 'The visible text label of the button.',
    },
    href: {
      type: 'text',
      display_name: 'Link URL',
      description: 'Optional URL. When set, renders as an anchor element.',
    },
    variant: {
      type: 'option',
      display_name: 'Variant',
      description: 'Visual style of the button.',
      default_value: 'default',
      options: [
        { value: 'default', name: 'Primary' },
        { value: 'outline', name: 'Secondary' },
        { value: 'ghost', name: 'Tertiary' },
        { value: 'link', name: 'Link' },
      ],
    },
    size: {
      type: 'option',
      display_name: 'Size',
      default_value: 'default',
      options: [
        { value: 'sm', name: 'Small' },
        { value: 'default', name: 'Medium' },
        { value: 'lg', name: 'Large' },
      ],
    },
    disabled: {
      type: 'boolean',
      display_name: 'Disabled',
      default_value: false,
    },
  },
};
