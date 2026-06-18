import { defineType, defineField, defineArrayMember } from 'sanity';

/** Product card — nested in productsSection. */
export const productCard = defineType({
  name: 'productCard',
  title: 'Product Card',
  type: 'object',
  fields: [
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      description:
        'Product photo. Recommended: square or 4:3 ratio, at least 600 × 600 px.',
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Short description',
      type: 'string',
      description:
        'Only shown when the section uses the "Category cards" layout. Optional for "Image carousel".',
    }),
    defineField({
      name: 'href',
      title: 'Link',
      type: 'link',
      description: 'Where this card links to when clicked.',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: { title: 'title', media: 'image' },
  },
});

/** Products Section — page section object. */
export const productsSection = defineType({
  name: 'productsSection',
  title: 'Products Section',
  type: 'object',
  fields: [
    defineField({
      name: 'variant',
      title: 'Layout style',
      type: 'string',
      description: 'Choose how products are displayed.',
      options: {
        list: [
          {
            title:
              'Category cards — a grid of product cards with images and descriptions',
            value: 'cards',
          },
          {
            title: 'Image carousel — a scrollable row of product images',
            value: 'carousel',
          },
        ],
      },
      initialValue: 'cards',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'eyebrow',
      title: 'Tag line',
      type: 'string',
      description:
        'A short label shown in small text above the heading (e.g. "Products"). Required for the "Category cards" layout, optional for "Image carousel".',
      initialValue: 'Products',
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const variant = (context.parent as { variant?: string } | undefined)
            ?.variant;
          if (variant !== 'carousel' && !value?.trim())
            return 'Tag line is required';
          return true;
        }),
    }),
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'subCopy',
      title: 'Supporting text',
      type: 'text',
      rows: 3,
      description:
        'A short paragraph shown below the heading. Required for the "Category cards" layout, optional for "Image carousel".',
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const variant = (context.parent as { variant?: string } | undefined)
            ?.variant;
          if (variant !== 'carousel' && !value?.trim())
            return 'Supporting text is required';
          return true;
        }),
    }),
    defineField({
      name: 'products',
      title: 'Products',
      type: 'array',
      of: [defineArrayMember({ type: 'productCard' })],
    }),
  ],
  preview: {
    select: { title: 'heading' },
    prepare: ({ title }) => ({ title: title || 'Products Section' }),
  },
});

export default null;
