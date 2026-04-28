import { defineType, defineField, defineArrayMember } from 'sanity';

/** Product Page singleton — controls the /products landing page content. */
export const productPage = defineType({
  name: 'productPage',
  title: 'Product Page',
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
      initialValue: 'Products',
      validation: (Rule) => Rule.required(),
      group: 'content',
    }),
    defineField({
      name: 'metaTitle',
      title: 'Search engine title (optional)',
      type: 'string',
      description:
        'A custom title shown in Google results and the browser tab. Leave blank to use the page title automatically.',
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
        'The image shown when someone shares this page on social media. Recommended: 1200 × 630 px.',
      group: 'seo',
    }),
    defineField({
      name: 'body',
      title: 'Page sections',
      type: 'array',
      description:
        'Build the products landing page by adding sections. Click + to add a new section.',
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
    prepare: () => ({ title: 'Product Page' }),
  },
});

export default null;
