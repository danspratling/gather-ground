/**
 * Storyblok content type schema for the Blog listing page.
 *
 * Root content type — create one story in Storyblok at slug "blog".
 * Controls the blog hero section content. The post grid is data-driven
 * from blog_post entries and needs no CMS configuration here.
 *
 * Push to Storyblok via the CLI:
 *   npm run sync-schemas
 */
export const blogPageSchema = {
  name: 'blog_page',
  display_name: 'Blog Page',
  is_root: true,
  is_nestable: false,
  schema: {
    hero_eyebrow: {
      type: 'text',
      display_name: 'Hero eyebrow',
      default_value: 'Blog',
      description: 'Small label above the hero heading.',
    },
    hero_heading: {
      type: 'text',
      display_name: 'Hero heading',
      required: true,
    },
    hero_sub_copy: {
      type: 'textarea',
      display_name: 'Hero sub-copy',
      required: true,
    },
    hero_privacy_policy_href: {
      type: 'text',
      display_name: 'Privacy policy URL',
      description:
        'When set, an email capture form is shown in the hero. Leave blank to hide the form.',
    },
  },
} as const;

export default null;
