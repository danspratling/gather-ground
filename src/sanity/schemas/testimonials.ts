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
      description: 'The testimonial text — what the customer said.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'platform',
      title: 'Platform (optional)',
      type: 'string',
      description:
        'Where the testimonial came from. Shown as a small icon on the card. Leave blank if not from social media.',
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
      title: 'Author photo',
      type: 'image',
      description:
        'A headshot or profile picture. Recommended: square, at least 200 × 200 px.',
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
      title: 'Author detail (optional)',
      type: 'string',
      description:
        'Extra info shown below the name — e.g. a social media handle like "@farmfan", a date, or a short subtitle.',
    }),
    defineField({
      name: 'authorSecondaryIsHandle',
      title: 'Treat the detail above as a social handle',
      type: 'boolean',
      description:
        'Turn this on if the text above is a social media handle (like @farmfan). This styles it as a link.',
      initialValue: false,
    }),
  ],
  preview: {
    select: { title: 'authorName', subtitle: 'quote', media: 'authorImage' },
  },
});

export default null;
