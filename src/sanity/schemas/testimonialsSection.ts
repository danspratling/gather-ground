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
    defineField({
      name: 'ctaPrimaryLabel',
      title: 'Primary button text (optional)',
      type: 'string',
      description:
        'Shown below the heading. Useful for linking out to a reviews platform like Trustpilot.',
    }),
    defineField({
      name: 'ctaPrimaryHref',
      title: 'Primary button link',
      type: 'link',
    }),
    defineField({
      name: 'ctaSecondaryLabel',
      title: 'Secondary button text (optional)',
      type: 'string',
      description: 'Leave blank to show only one button.',
    }),
    defineField({
      name: 'ctaSecondaryHref',
      title: 'Secondary button link',
      type: 'link',
    }),
  ],
  preview: {
    select: { title: 'heading' },
    prepare: ({ title }) => ({ title: title || 'Testimonials Section' }),
  },
});

export default null;
