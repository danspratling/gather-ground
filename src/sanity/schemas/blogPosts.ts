import { defineType, defineField, defineArrayMember } from 'sanity';

/** Blog Posts document — individual blog post entries. */
export const blogPosts = defineType({
  name: 'blogPosts',
  title: 'Blog Posts',
  type: 'document',
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title' },
      validation: (Rule) =>
        Rule.required().custom((value) => {
          const current = value?.current;
          if (!current) return true;
          if (current.startsWith('/') || current.endsWith('/')) {
            return 'Slug must not start or end with a slash';
          }
          if (current.includes('/')) {
            return 'Slug must be a single path segment (no embedded slashes)';
          }
          return true;
        }),
    }),
    defineField({
      name: 'image',
      title: 'Cover image',
      type: 'image',
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
      options: { layout: 'tags' },
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: [{ type: 'authors' }],
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime',
    }),
    defineField({
      name: 'metaTitle',
      title: 'Meta title',
      type: 'string',
      description:
        'Overrides the auto-generated page title. Leave blank to use the post title + site name.',
      group: 'seo',
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta description',
      type: 'text',
      rows: 3,
      description:
        'Overrides the auto-generated description. Leave blank to use the excerpt.',
      group: 'seo',
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'block',
        }),
        defineArrayMember({
          type: 'image',
          options: { hotspot: true },
        }),
        defineArrayMember({ type: 'callout' }),
      ],
      validation: (Rule) => Rule.required(),
    }),
  ],
  orderings: [
    {
      title: 'Published date, newest',
      name: 'publishedAtDesc',
      by: [{ field: 'publishedAt', direction: 'desc' }],
    },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'excerpt',
      media: 'image',
    },
  },
});

export default null;
