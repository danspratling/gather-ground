/**
 * Storyblok component schema for CallToAction.
 *
 * Push to Storyblok via the CLI:
 *   npx storyblok push-components --space 289911665285843
 */
export const callToActionSchema = {
  name: 'cta_block',
  display_name: 'Call To Action',
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
      display_name: 'Body text',
      required: true,
    },
    primary_button_label: {
      type: 'text',
      display_name: 'Primary button label',
      required: true,
    },
    primary_button_href: {
      type: 'multilink',
      display_name: 'Primary button URL',
      required: true,
    },
    primary_button_variant: {
      type: 'option',
      display_name: 'Primary button variant',
      default_value: 'default',
      options: [
        { value: 'default', name: 'Primary (filled)' },
        { value: 'outline', name: 'Outline' },
        { value: 'ghost', name: 'Ghost' },
        { value: 'link', name: 'Link' },
      ],
    },
    secondary_button_label: {
      type: 'text',
      display_name: 'Secondary button label',
      description: 'Leave blank to hide the secondary button.',
    },
    secondary_button_href: {
      type: 'multilink',
      display_name: 'Secondary button URL',
    },
    avatars: {
      type: 'bloks',
      display_name: 'Avatars',
      description: 'Optional group of avatars shown beneath the buttons.',
      restrict_components: true,
      component_whitelist: ['avatar'],
    },
  },
} as const;
