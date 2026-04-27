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
        'Overrides the auto-generated description. Leave blank to use the first hero sub-copy.',
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
    prepare: () => ({ title: 'Product Page' }),
  },
});

export default null;
