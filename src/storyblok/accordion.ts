/**
 * Storyblok component schema for Accordion.
 *
 * Push to Storyblok via the CLI:
 *   npx storyblok push-components --space 289911665285843
 */
export const accordionSchema = {
  name: 'accordion',
  display_name: 'Accordion',
  is_root: false,
  is_nestable: true,
  schema: {
    items: {
      type: 'bloks',
      display_name: 'Items',
      required: true,
      restrict_components: true,
      component_whitelist: ['accordion_item'],
    },
  },
} as const;

export const accordionItemSchema = {
  name: 'accordion_item',
  display_name: 'Accordion Item',
  is_root: false,
  is_nestable: true,
  schema: {
    title: {
      type: 'text',
      display_name: 'Title',
      required: true,
    },
    detail: {
      type: 'textarea',
      display_name: 'Detail',
      required: true,
    },
  },
} as const;
