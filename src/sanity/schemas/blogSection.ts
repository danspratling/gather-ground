import { defineType, defineField, defineArrayMember } from 'sanity';

/** Blog Section — page section object. References blog post documents. */
export const blogSection = defineType({
  name: 'blogSection',
  title: 'Blog Section',
  type: 'object',
  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Tag line (optional)',
      type: 'string',
      description:
        'A short label shown in small text above the heading (e.g. "From the blog"). Leave blank to hide.',
    }),
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
      name: 'viewAllHref',
      title: '"View all" button link',
      type: 'link',
      description: 'Usually points to the blog listing page.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'viewAllLabel',
      title: '"View all" button text',
      type: 'string',
      initialValue: 'View all updates',
    }),
    defineField({
      name: 'posts',
      title: 'Blog posts',
      type: 'array',
      description: 'Pick the posts to feature in this section.',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{ type: 'blogPosts' }],
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
