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
      title: 'Meta title',
      type: 'string',
      description:
        'Overrides the auto-generated page title. Leave blank to use the page title + site name.',
      group: 'seo',
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta description',
      type: 'text',
      rows: 3,
      description:
        'Overrides the auto-generated description. Leave blank to use the first hero sub-copy. Recommended maximum: 160 characters.',
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
    prepare: () => ({ title: 'Product Page' }),
  },
});

export default null;
