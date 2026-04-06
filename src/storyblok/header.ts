/**
 * Storyblok component schema for Header.
 *
 * Push to Storyblok via the CLI:
 *   npx storyblok push-components --space 289911665285843
 */
export const headerSchema = {
  name: 'header',
  display_name: 'Header',
  is_root: false,
  is_nestable: false,
  schema: {
    logo_src: {
      type: 'asset',
      display_name: 'Logo',
      required: true,
    },
    nav_links: {
      type: 'bloks',
      display_name: 'Nav links',
      restrict_components: true,
      component_whitelist: ['header_nav_link'],
    },
    cta_label: {
      type: 'text',
      display_name: 'CTA label',
      default_value: 'Order now',
    },
    cta_href: {
      type: 'multilink',
      display_name: 'CTA URL',
    },
  },
} as const;

export const headerNavLinkSchema = {
  name: 'header_nav_link',
  display_name: 'Header Nav Link',
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
      description: 'Leave empty if this link opens a dropdown menu',
    },
    menu: {
      type: 'bloks',
      display_name: 'Dropdown items',
      restrict_components: true,
      component_whitelist: ['nav_menu_item'],
    },
  },
} as const;
