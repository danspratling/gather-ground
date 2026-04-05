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
      type: 'text',
      display_name: 'View all URL',
      required: true,
    },
    view_all_label: {
      type: 'text',
      display_name: 'View all button label',
      default_value: 'View all updates',
    },
    posts: {
      type: 'bloks',
      display_name: 'Blog posts',
      required: true,
      restrict_components: true,
      component_whitelist: ['blog_card'],
    },
  },
} as const;
