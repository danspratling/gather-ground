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
      title: 'Sub copy',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'faqs',
      title: 'FAQs',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{ type: 'faq' }],
        }),
      ],
    }),
    defineField({
      name: 'ctaHeading',
      title: 'CTA heading',
      type: 'string',
    }),
    defineField({
      name: 'ctaBody',
      title: 'CTA body',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'ctaPrimaryLabel',
      title: 'CTA primary button label',
      type: 'string',
    }),
    defineField({
      name: 'ctaPrimaryHref',
      title: 'CTA primary button URL',
      type: 'link',
    }),
    defineField({
      name: 'ctaSecondaryLabel',
      title: 'CTA secondary button label',
      type: 'string',
    }),
    defineField({
      name: 'ctaSecondaryHref',
      title: 'CTA secondary button URL',
      type: 'link',
    }),
  ],
  preview: {
    select: { title: 'heading' },
    prepare: ({ title }) => ({ title: title || 'FAQ Section' }),
  },
});

export default null;
