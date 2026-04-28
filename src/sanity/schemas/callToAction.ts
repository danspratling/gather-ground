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
      title: 'Layout style',
      type: 'string',
      description:
        'Choose how this call-to-action block is arranged on the page.',
      options: {
        list: [
          {
            title: 'Centred — heading, text, and buttons centred on the page',
            value: 'simple-centered',
          },
          {
            title:
              'Left-aligned — heading and text on the left, buttons beside them',
            value: 'simple-left',
          },
          {
            title: 'Card (centred) — same as centred, inside a coloured card',
            value: 'card-centered',
          },
          {
            title:
              'Card (left-aligned) — same as left-aligned, inside a coloured card',
            value: 'card-left',
          },
          {
            title:
              'Split image — text and buttons on the left, large image on the right',
            value: 'split-image',
          },
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
      title: 'Description',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'primaryCtaLabel',
      title: 'Main button text',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'primaryCtaHref',
      title: 'Main button link',
      type: 'link',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'secondaryCtaLabel',
      title: 'Second button text (optional)',
      type: 'string',
      description: 'Leave blank to show only one button.',
    }),
    defineField({
      name: 'secondaryCtaHref',
      title: 'Second button link',
      type: 'link',
      description: 'Only needed if the second button text is set.',
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: { hotspot: true },
      description:
        'Required for the "Split image" layout. Recommended: at least 800 × 600 px, landscape orientation.',
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
