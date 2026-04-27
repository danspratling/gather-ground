import { defineType, defineField, defineArrayMember } from 'sanity';

/**
 * Products document — individual product detail page.
 *
 * Routed under `/products/[slug]`. The `/products` prefix is owned by the
 * route, not the slug — the slug must be a single path segment.
 *
 * Uses the same section-based body as the generic `page` type so editors
 * can compose product pages from the same building blocks.
 */
export const products = defineType({
  name: 'products',
  title: 'Products',
  type: 'document',
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
      description:
        'A single URL segment. The product will be served at /products/<slug>.',
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
      name: 'body',
      title: 'Body sections',
      type: 'array',
      of: [
        defineArrayMember({ type: 'heroSection' }),
        defineArrayMember({ type: 'productsSection' }),
        defineArrayMember({ type: 'testimonialsSection' }),
        defineArrayMember({ type: 'faqSection' }),
        defineArrayMember({ type: 'blogSection' }),
        defineArrayMember({ type: 'callToAction' }),
        defineArrayMember({ type: 'contentSection' }),
      ],
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'slug.current' },
    prepare: ({ title, subtitle }) => ({
      title,
      subtitle: subtitle ? `/products/${subtitle}` : undefined,
    }),
  },
});

export default null;
