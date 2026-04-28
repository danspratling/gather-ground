import { defineType, defineField } from 'sanity';

/** FAQs document — reusable across sections via references. */
export const faqs = defineType({
  name: 'faqs',
  title: 'FAQs',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Question',
      type: 'string',
      description: 'The question as the visitor would ask it.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'detail',
      title: 'Answer',
      type: 'text',
      rows: 4,
      description: 'The answer shown when the question is expanded.',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: { title: 'title' },
  },
});

export default null;
