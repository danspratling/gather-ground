import { defineType, defineField } from 'sanity';

/** Blog Page settings — controls the blog listing hero. */
export const blogPage = defineType({
  name: 'blogPage',
  title: 'Blog Page',
  type: 'document',
  fields: [
    defineField({
      name: 'slug',
      title: 'URL slug',
      type: 'slug',
      description:
        'The URL path for the blog index (e.g. "blog" → /blog). Also update src/pages/blog/ if you rename this.',
      options: { source: () => 'blog' },
      initialValue: { current: 'blog' },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'heroEyebrow',
      title: 'Hero eyebrow',
      type: 'string',
      initialValue: 'Blog',
    }),
    defineField({
      name: 'heroHeading',
      title: 'Hero heading',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'heroSubCopy',
      title: 'Hero sub-copy',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'heroPrivacyPolicyLink',
      title: 'Privacy policy page',
      type: 'link',
      description:
        'When set, an email capture form is shown in the hero. Leave blank to hide the form.',
    }),
  ],
  preview: {
    prepare: () => ({ title: 'Blog Page Settings' }),
  },
});

export default null;
