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
      title: 'URL path',
      type: 'slug',
      description:
        'The part of the web address after /products/ — click Generate to create it from the title.',
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
      title: 'Search engine title (optional)',
      type: 'string',
      description:
        'A custom title shown in Google results and the browser tab. Leave blank to use the product title automatically.',
      group: 'seo',
    }),
    defineField({
      name: 'metaDescription',
      title: 'Search engine description (optional)',
      type: 'text',
      rows: 3,
      description:
        'A short summary shown in Google results. Keep it under 160 characters. Leave blank for the auto-generated version.',
      validation: (Rule) => Rule.max(160),
      group: 'seo',
    }),
    defineField({
      name: 'ogImage',
      title: 'Social sharing image (optional)',
      type: 'image',
      description:
        'The image shown when someone shares this product page on social media. Recommended: 1200 × 630 px.',
      group: 'seo',
    }),
    defineField({
      name: 'featuredImage',
      title: 'Featured image',
      type: 'image',
      description:
        'Used everywhere this product is shown as a card — the shop listing, any Products sections, and social sharing previews. Set this first before building page sections.',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt text',
          type: 'string',
          description:
            'Describe the image for screen readers and search engines.',
        }),
      ],
      group: 'content',
    }),
    defineField({
      name: 'gallery',
      title: 'Image gallery',
      type: 'array',
      description:
        'Additional product images for the gallery on the product detail page. Add multiple angles, lifestyle shots, or detail views.',
      group: 'content',
      of: [
        defineArrayMember({
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({
              name: 'alt',
              title: 'Alt text',
              type: 'string',
              description:
                'Describe the image for screen readers and search engines.',
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'body',
      title: 'Page sections',
      type: 'array',
      description:
        'Build the product page by adding sections. Click + to add a new section.',
      group: 'content',
      of: [
        defineArrayMember({ type: 'heroSection' }),
        defineArrayMember({ type: 'contentSection' }),
        defineArrayMember({ type: 'productsSection' }),
        defineArrayMember({ type: 'blogSection' }),
        defineArrayMember({ type: 'faqSection' }),
        defineArrayMember({ type: 'testimonialsSection' }),
        defineArrayMember({ type: 'instagramFeedSection' }),
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
                'instagramFeedSection',
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
