/**
 * Storyblok component schema for BlogSection.
 *
 * Push to Storyblok via the CLI:
 *   npx storyblok push-components --space 289911665285843
 */
export const blogSectionSchema = {
  name: 'blog_section',
  display_name: 'Blog Section',
  is_root: false,
  is_nestable: true,
  schema: {
    eyebrow: {
      type: 'text',
      display_name: 'Eyebrow label',
    },
    heading: {
      type: 'text',
      display_name: 'Heading',
      required: true,
    },
    sub_copy: {
      type: 'textarea',
      display_name: 'Sub copy',
    },
    view_all_href: {
      type: 'multilink',
      display_name: 'View all URL',
      required: true,
    },
    view_all_label: {
      type: 'text',
      display_name: 'View all button label',
      default_value: 'View all updates',
    },
    posts: {
      type: 'options',
      display_name: 'Blog posts',
      source: 'internal_stories',
      allow_target_types: ['story'],
      filter_content_type: ['blog_post'],
      entry_appearance: 'card',
      allow_advanced_search: true,
    },
  },
} as const;
