/**
 * Storyblok component schema for NavMenu.
 *
 * Push to Storyblok via the CLI:
 *   npx storyblok push-components --space 289911665285843
 */
export const navMenuSchema = {
  name: 'nav_menu',
  display_name: 'Nav Menu',
  is_root: false,
  is_nestable: true,
  schema: {
    label: {
      type: 'text',
      display_name: 'Trigger label',
      required: true,
    },
    items: {
      type: 'bloks',
      display_name: 'Menu items',
      restrict_components: true,
      component_whitelist: ['nav_menu_item'],
    },
  },
} as const;

export const navMenuItemSchema = {
  name: 'nav_menu_item',
  display_name: 'Nav Menu Item',
  is_root: false,
  is_nestable: true,
  schema: {
    label: {
      type: 'text',
      display_name: 'Label',
      required: true,
    },
    href: {
      type: 'multilink',
      display_name: 'URL',
      required: true,
    },
    description: {
      type: 'text',
      display_name: 'Description',
    },
  },
} as const;
