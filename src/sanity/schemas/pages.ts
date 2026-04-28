import { defineType, defineField, defineArrayMember } from 'sanity';

/** Pages document — generic static pages composed from sections. */
export const pages = defineType({
  name: 'pages',
  title: 'Pages',
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
      options: { source: 'title' },
      validation: (Rule) => Rule.required(),
      group: 'content',
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
        defineArrayMember({ type: 'contactHero' }),
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
              of: ['heroSection', 'contactHero'],
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
              title: 'Call to Action',
              of: ['callToAction'],
            },
          ],
        },
      },
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'slug.current' },
  },
});

export default null;
