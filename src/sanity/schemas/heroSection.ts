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
      description: 'The large heading shown at the top of the page.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'subCopy',
      title: 'Supporting text',
      type: 'text',
      rows: 3,
      description: 'A short paragraph shown below the headline.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'primaryCtaLabel',
      title: 'Main button text',
      type: 'string',
      description: 'Label for the highlighted button (e.g. "Our Products").',
      initialValue: 'Our Products',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'primaryCtaHref',
      title: 'Main button link',
      type: 'link',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'secondaryCtaLabel',
      title: 'Second button text (optional)',
      type: 'string',
      description:
        'Label for a less prominent button next to the main one. Leave blank to show only one button.',
      initialValue: 'Get in touch',
    }),
    defineField({
      name: 'secondaryCtaHref',
      title: 'Second button link',
      type: 'link',
      description:
        'Where the second button goes. Only needed if the text above is set.',
    }),
    defineField({
      name: 'image',
      title: 'Hero image',
      type: 'image',
      description:
        'The large image displayed alongside the headline. Recommended: at least 1200 × 800 px, landscape orientation.',
      options: { hotspot: true },
    }),
  ],
  preview: {
    select: { title: 'headline' },
    prepare: ({ title }) => ({ title: title || 'Hero Section' }),
  },
});

export default null;
