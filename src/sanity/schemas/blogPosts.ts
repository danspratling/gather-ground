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
      group: 'content',
    }),
    defineField({
      name: 'slug',
      title: 'URL path',
      type: 'slug',
      description:
        'The part of the web address after /blog/ — click Generate to create it from the title.',
      options: { source: 'title' },
      group: 'content',
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
      description:
        'The main image shown at the top of the post and on cards. Recommended: at least 1200 × 630 px, landscape.',
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
      group: 'content',
    }),
    defineField({
      name: 'excerpt',
      title: 'Short summary',
      type: 'text',
      rows: 3,
      description:
        'Shown on blog cards and in search results. Keep it to 1–2 sentences.',
      validation: (Rule) => Rule.required(),
      group: 'content',
    }),
    defineField({
      name: 'categories',
      title: 'Tags',
      type: 'array',
      description:
        'Add tags to help visitors filter posts (e.g. "Recipes", "Farm news"). Type and press Enter to add.',
      of: [defineArrayMember({ type: 'string' })],
      options: { layout: 'tags' },
      group: 'content',
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: [{ type: 'authors' }],
      group: 'content',
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published date',
      type: 'datetime',
      description:
        'When the post was published. Used for ordering and shown on the post page.',
      group: 'content',
    }),
    defineField({
      name: 'metaTitle',
      title: 'Search engine title (optional)',
      type: 'string',
      description:
        'A custom title shown in Google results. Leave blank to use the post title automatically.',
      group: 'seo',
    }),
    defineField({
      name: 'metaDescription',
      title: 'Search engine description (optional)',
      type: 'text',
      rows: 3,
      description:
        'A custom description shown in Google results. Leave blank to use the short summary. Keep it under 160 characters.',
      validation: (Rule) => Rule.max(160),
      group: 'seo',
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      group: 'content',
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
