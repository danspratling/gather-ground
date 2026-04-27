import { defineType, defineField, defineArrayMember } from 'sanity';

/** Products Page singleton — controls the /products landing page content. */
export const productsPage = defineType({
  name: 'productsPage',
  title: 'Products Page',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      initialValue: 'Products',
      validation: (Rule) => Rule.required(),
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
    prepare: () => ({ title: 'Products Page' }),
  },
});

export default null;
