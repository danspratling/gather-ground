import { defineType, defineField } from 'sanity';

/**
 * Call To Action — page section object with variant support.
 * Maps to 5 CTA variants: simple-centered, simple-left, card-centered, card-left, split-image.
 */
export const callToAction = defineType({
  name: 'callToAction',
  title: 'Call To Action',
  type: 'object',
  fields: [
    defineField({
      name: 'variant',
      title: 'Variant',
      type: 'string',
      options: {
        list: [
          { title: 'Simple Centered', value: 'simple-centered' },
          { title: 'Simple Left', value: 'simple-left' },
          { title: 'Card Centered', value: 'card-centered' },
          { title: 'Card Left', value: 'card-left' },
          { title: 'Split Image', value: 'split-image' },
        ],
      },
      initialValue: 'simple-centered',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'primaryCtaLabel',
      title: 'Primary CTA label',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'primaryCtaHref',
      title: 'Primary CTA URL',
      type: 'link',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'secondaryCtaLabel',
      title: 'Secondary CTA label',
      type: 'string',
    }),
    defineField({
      name: 'secondaryCtaHref',
      title: 'Secondary CTA URL',
      type: 'link',
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: { hotspot: true },
      description: 'Required for the split-image variant.',
      hidden: ({ parent }) => parent?.variant !== 'split-image',
    }),
  ],
  preview: {
    select: { title: 'heading', subtitle: 'variant' },
    prepare: ({ title, subtitle }) => ({
      title: title || 'Call To Action',
      subtitle: subtitle,
    }),
  },
});

export default null;
