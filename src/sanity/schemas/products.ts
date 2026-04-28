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
      title: 'Slug',
      type: 'slug',
      description:
        'A single URL segment. The product will be served at /products/<slug>.',
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
      name: 'metaTitle',
      title: 'Meta title',
      type: 'string',
      description:
        'Overrides the auto-generated page title. Leave blank to use the content title + site name.',
      group: 'seo',
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta description',
      type: 'text',
      rows: 3,
      description:
        'SEO description shown in search results and social cards. Recommended maximum: 160 characters.',
      validation: (Rule) => Rule.max(160),
      group: 'seo',
    }),
    defineField({
      name: 'ogImage',
      title: 'Social share image',
      type: 'image',
      description: 'Image used for Open Graph / Twitter cards.',
      group: 'seo',
    }),
    defineField({
      name: 'body',
      title: 'Body sections',
      type: 'array',
      group: 'content',
      of: [
        defineArrayMember({ type: 'heroSection' }),
        defineArrayMember({ type: 'contentSection' }),
        defineArrayMember({ type: 'productsSection' }),
        defineArrayMember({ type: 'blogSection' }),
        defineArrayMember({ type: 'faqSection' }),
        defineArrayMember({ type: 'testimonialsSection' }),
        defineArrayMember({ type: 'callToAction' }),
      ],
      options: {
        insertMenu: {
          groups: [
            {
              name: 'hero',
              title: 'Hero',
              of: ['heroSection'],
            },
            {
              name: 'content',
              title: 'Content',
              of: [
                'contentSection',
                'productsSection',
                'blogSection',
                'faqSection',
                'testimonialsSection',
              ],
            },
            {
              name: 'cta',
              title: 'Action',
              of: ['callToAction'],
            },
          ],
        },
      },
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
