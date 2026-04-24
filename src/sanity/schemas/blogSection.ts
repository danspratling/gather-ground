import { defineType, defineField, defineArrayMember } from 'sanity';

/** Blog Section — page section object. References blog post documents. */
export const blogSection = defineType({
  name: 'blogSection',
  title: 'Blog Section',
  type: 'object',
  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow label',
      type: 'string',
    }),
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
      name: 'viewAllHref',
      title: 'View all URL',
      type: 'link',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'viewAllLabel',
      title: 'View all button label',
      type: 'string',
      initialValue: 'View all updates',
    }),
    defineField({
      name: 'posts',
      title: 'Blog posts',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{ type: 'blogPost' }],
        }),
      ],
    }),
  ],
  preview: {
    select: { title: 'heading' },
    prepare: ({ title }) => ({ title: title || 'Blog Section' }),
  },
});

export default null;
