import { defineType, defineField } from 'sanity';

/** Hero Section — page section object. */
export const heroSection = defineType({
  name: 'heroSection',
  title: 'Hero Section',
  type: 'object',
  fields: [
    defineField({
      name: 'headline',
      title: 'Headline',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'subCopy',
      title: 'Sub-copy',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'primaryCtaLabel',
      title: 'Primary CTA label',
      type: 'string',
      initialValue: 'Our Products',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'primaryCtaHref',
      title: 'Primary CTA URL',
      type: 'link',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'secondaryCtaLabel',
      title: 'Secondary CTA label',
      type: 'string',
      initialValue: 'Get in touch',
    }),
    defineField({
      name: 'secondaryCtaHref',
      title: 'Secondary CTA URL',
      type: 'link',
    }),
    defineField({
      name: 'image',
      title: 'Hero image',
      type: 'image',
      options: { hotspot: true },
    }),
  ],
  preview: {
    select: { title: 'headline' },
    prepare: ({ title }) => ({ title: title || 'Hero Section' }),
  },
});

export default null;
