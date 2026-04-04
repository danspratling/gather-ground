/**
 * Storyblok component schema for Footer.
 *
 * Push to Storyblok via the CLI:
 *   npx storyblok push-components --space 289911665285843
 *
 * Field names are snake_case (Storyblok convention) and map 1-to-1
 * to the camelCase keys in src/types/footer.ts.
 */
export const footerSchema = {
  name: 'footer',
  display_name: 'Footer',
  is_root: false,
  is_nestable: false,
  schema: {
    logo_src: {
      type: 'asset',
      filetypes: ['images'],
      display_name: 'Logo',
      description: 'Gather Ground logo image displayed in the footer.',
    },
    logo_alt: {
      type: 'text',
      display_name: 'Logo alt text',
      default_value: 'Gather Ground',
    },
    description: {
      type: 'textarea',
      display_name: 'Description',
      description: 'Short brand description shown below the logo.',
    },
    social_links: {
      type: 'bloks',
      display_name: 'Social links',
      description:
        'Social media profiles. Each entry uses the footer_social_link component.',
      restrict_components: true,
      component_whitelist: ['footer_social_link'],
    },
    link_groups: {
      type: 'bloks',
      display_name: 'Link groups',
      description: 'Navigation column groups (e.g. Company, Products).',
      restrict_components: true,
      component_whitelist: ['footer_link_group'],
    },
    newsletter_heading: {
      type: 'text',
      display_name: 'Newsletter heading',
      default_value: 'Stay up to date',
    },
    copyright_text: {
      type: 'text',
      display_name: 'Copyright text',
      description: 'e.g. © 2026 Gather Ground',
    },
    legal_links: {
      type: 'bloks',
      display_name: 'Legal links',
      description: 'Bottom-bar links such as Terms, Privacy, Cookies.',
      restrict_components: true,
      component_whitelist: ['footer_legal_link'],
    },
  },
} as const;

/** Nestable component — a single social platform entry. */
export const footerSocialLinkSchema = {
  name: 'footer_social_link',
  display_name: 'Footer social link',
  is_root: false,
  is_nestable: true,
  schema: {
    platform: {
      type: 'option',
      display_name: 'Platform',
      options: [
        { name: 'Instagram', value: 'instagram' },
        { name: 'Facebook', value: 'facebook' },
        { name: 'TikTok', value: 'tiktok' },
        { name: 'X / Twitter', value: 'twitter' },
        { name: 'LinkedIn', value: 'linkedin' },
      ],
    },
    href: {
      type: 'text',
      display_name: 'URL',
    },
    label: {
      type: 'text',
      display_name: 'Accessible label',
      description: 'Screen-reader label for the icon link.',
    },
  },
} as const;

/** Nestable component — a navigation column. */
export const footerLinkGroupSchema = {
  name: 'footer_link_group',
  display_name: 'Footer link group',
  is_root: false,
  is_nestable: true,
  schema: {
    heading: {
      type: 'text',
      display_name: 'Heading',
    },
    links: {
      type: 'bloks',
      display_name: 'Links',
      restrict_components: true,
      component_whitelist: ['footer_link'],
    },
  },
} as const;

/** Nestable component — a single navigation link, optionally badged. */
export const footerLinkSchema = {
  name: 'footer_link',
  display_name: 'Footer link',
  is_root: false,
  is_nestable: true,
  schema: {
    label: {
      type: 'text',
      display_name: 'Label',
    },
    href: {
      type: 'text',
      display_name: 'URL',
    },
    badge: {
      type: 'text',
      display_name: 'Badge',
      description:
        'Optional badge text shown after the link label (e.g. "New").',
    },
  },
} as const;

/** Nestable component — a bottom-bar legal link. */
export const footerLegalLinkSchema = {
  name: 'footer_legal_link',
  display_name: 'Footer legal link',
  is_root: false,
  is_nestable: true,
  schema: {
    label: {
      type: 'text',
      display_name: 'Label',
    },
    href: {
      type: 'text',
      display_name: 'URL',
    },
  },
} as const;
