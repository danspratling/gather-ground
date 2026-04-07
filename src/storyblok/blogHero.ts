/**
 * Storyblok nestable blok schema for the Blog Hero section.
 *
 * Used in the blog/index.astro page frontmatter to define CMS-editable
 * hero content. Push to Storyblok via:
 *   npm run sync-schemas
 */
export const blogHeroSchema = {
  name: 'blog_hero',
  display_name: 'Blog Hero',
  is_root: false,
  is_nestable: true,
  schema: {
    eyebrow: {
      type: 'text',
      display_name: 'Eyebrow',
      required: true,
      description: 'Small label above the heading (e.g. "Blog").',
    },
    heading: {
      type: 'text',
      display_name: 'Heading',
      required: true,
    },
    sub_copy: {
      type: 'textarea',
      display_name: 'Sub-copy',
      required: true,
    },
    privacy_policy_href: {
      type: 'text',
      display_name: 'Privacy policy URL',
      description:
        'When set, an email capture form and privacy note are shown.',
    },
  },
} as const;

export default null;
