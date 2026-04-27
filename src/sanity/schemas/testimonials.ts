import { defineType, defineField } from 'sanity';

/** Testimonials document — reusable across sections via references. */
export const testimonials = defineType({
  name: 'testimonials',
  title: 'Testimonials',
  type: 'document',
  fields: [
    defineField({
      name: 'quote',
      title: 'Quote',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'platform',
      title: 'Platform',
      type: 'string',
      options: {
        list: [
          { title: 'Twitter / X', value: 'twitter' },
          { title: 'Instagram', value: 'instagram' },
          { title: 'Facebook', value: 'facebook' },
          { title: 'TikTok', value: 'tiktok' },
          { title: 'LinkedIn', value: 'linkedin' },
        ],
      },
    }),
    defineField({
      name: 'authorImage',
      title: 'Author image',
      type: 'image',
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'authorName',
      title: 'Author name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'authorSecondary',
      title: 'Author secondary text',
      type: 'string',
      description: 'Handle, date, or subtitle.',
    }),
    defineField({
      name: 'authorSecondaryIsHandle',
      title: 'Secondary is handle',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  preview: {
    select: { title: 'authorName', subtitle: 'quote', media: 'authorImage' },
  },
});

export default null;
