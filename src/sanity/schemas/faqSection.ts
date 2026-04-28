import { defineType, defineField, defineArrayMember } from 'sanity';

/** FAQ Section — page section object. References faq documents. */
export const faqSection = defineType({
  name: 'faqSection',
  title: 'FAQ Section',
  type: 'object',
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'subCopy',
      title: 'Supporting text (optional)',
      type: 'text',
      rows: 3,
      description:
        'A short paragraph shown below the heading. Leave blank to hide.',
    }),
    defineField({
      name: 'faqs',
      title: 'Questions',
      type: 'array',
      description:
        'Pick existing FAQ entries. Create new ones under FAQs in the sidebar.',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{ type: 'faqs' }],
        }),
      ],
    }),
    defineField({
      name: 'ctaHeading',
      title: 'Bottom box — heading (optional)',
      type: 'string',
      description:
        'A coloured box appears below the questions if you fill this in. Leave blank to hide the box entirely.',
    }),
    defineField({
      name: 'ctaBody',
      title: 'Bottom box — description',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'ctaPrimaryLabel',
      title: 'Bottom box — main button text',
      type: 'string',
    }),
    defineField({
      name: 'ctaPrimaryHref',
      title: 'Bottom box — main button link',
      type: 'link',
    }),
    defineField({
      name: 'ctaSecondaryLabel',
      title: 'Bottom box — second button text (optional)',
      type: 'string',
      description: 'Leave blank to show only one button.',
    }),
    defineField({
      name: 'ctaSecondaryHref',
      title: 'Bottom box — second button link',
      type: 'link',
    }),
  ],
  preview: {
    select: { title: 'heading' },
    prepare: ({ title }) => ({ title: title || 'FAQ Section' }),
  },
});

export default null;
