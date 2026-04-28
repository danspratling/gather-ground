import { defineType, defineField } from 'sanity';

/** Blog Page settings — controls the blog listing hero. */
export const blogPage = defineType({
  name: 'blogPage',
  title: 'Blog Page',
  type: 'document',
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({
      name: 'metaTitle',
      title: 'Search engine title (optional)',
      type: 'string',
      description:
        'A custom title shown in Google results. Leave blank to use "Blog | site name" automatically.',
      group: 'seo',
    }),
    defineField({
      name: 'metaDescription',
      title: 'Search engine description (optional)',
      type: 'text',
      rows: 3,
      description:
        'A short summary shown in Google results. Leave blank to use the hero text. Keep it under 160 characters.',
      validation: (Rule) => Rule.max(160),
      group: 'seo',
    }),
    defineField({
      name: 'heroEyebrow',
      title: 'Tag line',
      type: 'string',
      description:
        'A short label shown in small text above the heading (e.g. "Blog").',
      initialValue: 'Blog',
      group: 'content',
    }),
    defineField({
      name: 'heroHeading',
      title: 'Heading',
      type: 'string',
      validation: (Rule) => Rule.required(),
      group: 'content',
    }),
    defineField({
      name: 'heroSubCopy',
      title: 'Supporting text',
      type: 'text',
      rows: 3,
      description: 'A short paragraph shown below the heading.',
      validation: (Rule) => Rule.required(),
      group: 'content',
    }),
    defineField({
      name: 'heroPrivacyPolicyLink',
      title: 'Email signup privacy page',
      type: 'link',
      description:
        'When set, an email signup form is shown in the hero area with a link to this privacy page. Leave blank to hide the form.',
      group: 'content',
    }),
  ],
  preview: {
    prepare: () => ({ title: 'Blog Page' }),
  },
});

export default null;
