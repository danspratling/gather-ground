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
      title: 'Meta title',
      type: 'string',
      description:
        'Overrides the auto-generated page title. Leave blank to use "Blog | {site name}".',
      group: 'seo',
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta description',
      type: 'text',
      rows: 3,
      description:
        'Overrides the auto-generated description. Leave blank to use the hero sub-copy.',
      group: 'seo',
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
    prepare: () => ({ title: 'Blog Page' }),
  },
});

export default null;
