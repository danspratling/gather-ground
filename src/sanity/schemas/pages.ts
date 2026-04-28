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
      title: 'URL path',
      type: 'slug',
      description:
        'The web address for this page — click Generate to create it from the title.',
      options: { source: 'title' },
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
        'Build the page by adding sections. Click + to add a new section.',
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
  },
});

export default null;
