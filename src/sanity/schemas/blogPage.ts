import { defineType, defineField } from 'sanity';

/** Blog Page settings — controls the blog listing hero. */
export const blogPage = defineType({
  name: 'blogPage',
  title: 'Blog Page',
  type: 'document',
  fields: [
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
      name: 'heroPrivacyPolicyHref',
      title: 'Privacy policy URL',
      type: 'url',
      description:
        'When set, an email capture form is shown in the hero. Leave blank to hide the form.',
      validation: (Rule) =>
        Rule.uri({ allowRelative: true, scheme: ['http', 'https'] }),
    }),
  ],
  preview: {
    prepare: () => ({ title: 'Blog Page Settings' }),
  },
});

export default null;
