import { defineType, defineField, defineArrayMember } from 'sanity';

/** Testimonials Section — page section object. References testimonial documents. */
export const testimonialsSection = defineType({
  name: 'testimonialsSection',
  title: 'Testimonials Section',
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
      title: 'Supporting text',
      type: 'text',
      rows: 3,
      description: 'A short paragraph shown below the heading.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'testimonials',
      title: 'Testimonials',
      type: 'array',
      description:
        'Pick existing testimonials. Create new ones under Testimonials in the sidebar.',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{ type: 'testimonials' }],
        }),
      ],
    }),
  ],
  preview: {
    select: { title: 'heading' },
    prepare: ({ title }) => ({ title: title || 'Testimonials Section' }),
  },
});

export default null;
