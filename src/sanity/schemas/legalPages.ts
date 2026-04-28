import { defineField, defineType, defineArrayMember } from 'sanity';

export const legalPages = defineType({
  name: 'legalPages',
  title: 'Legal Pages',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title' },
      validation: (r) =>
        r.required().custom((value) => {
          const slug = value?.current;
          if (!slug) return true;
          if (slug.includes('/')) return 'Slug must not contain slashes.';
          return true;
        }),
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [defineArrayMember({ type: 'block' })],
      validation: (r) => r.required(),
    }),
  ],
});

export default null;
