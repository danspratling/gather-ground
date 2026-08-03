import { defineType, defineField, defineArrayMember } from 'sanity';
import { IconPicker } from '../components/IconPicker';

/** Feature item — nested in contentSection (simple variant). */
export const contentFeatureItem = defineType({
  name: 'contentFeatureItem',
  title: 'Feature Item',
  type: 'object',
  fields: [
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
      rows: 2,
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: { title: 'heading' },
  },
});

/** Icon feature item — nested in contentSection (icons-featured-image variant). */
export const contentIconFeature = defineType({
  name: 'contentIconFeature',
  title: 'Icon Feature',
  type: 'object',
  fields: [
    defineField({
      name: 'icon',
      title: 'Icon',
      type: 'string',
      description: 'Optional. Search and select an icon to display above the heading.',
      components: { input: IconPicker },
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
      rows: 2,
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: { title: 'heading' },
  },
});

/**
 * Content Section — page section object with variant support.
 * Maps to 4 variants: simple, alternating, icons-featured-image, title.
 */
export const contentSection = defineType({
  name: 'contentSection',
  title: 'Content Section',
  type: 'object',
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'settings', title: 'Settings' },
  ],
  fields: [
    defineField({
      name: 'variant',
      title: 'Layout style',
      type: 'string',
      description: 'Choose how this section is arranged on the page.',
      group: 'settings',
      options: {
        list: [
          {
            title: 'Simple — heading, text, and a list of features',
            value: 'simple',
          },
          {
            title:
              'Alternating — text alternating left or right, with an image',
            value: 'alternating',
          },
          {
            title:
              'Icons with large image — icon features above a full-width image',
            value: 'icons-featured-image',
          },
          {
            title:
              'Title only — a heading and text block (no features or images)',
            value: 'title',
          },
        ],
      },
      initialValue: 'simple',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'eyebrow',
      title: 'Tag line',
      type: 'string',
      description:
        'A short label shown above the heading in small text (e.g. "Why choose us"). Optional.',
      group: 'content',
      hidden: ({ parent }) =>
        parent?.variant !== 'icons-featured-image' &&
        parent?.variant !== 'title',
    }),
    defineField({
      name: 'icon',
      title: 'Icon',
      type: 'string',
      description: 'Optional. Search and select an icon to display above the heading.',
      group: 'content',
      hidden: ({ parent }) =>
        parent?.variant !== 'simple' && parent?.variant !== 'alternating',
      components: { input: IconPicker },
    }),
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      group: 'content',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'body',
      title: 'Description',
      type: 'text',
      rows: 3,
      group: 'content',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'features',
      title: 'Features',
      type: 'array',
      description:
        'A list of feature highlights, each with a heading and short description.',
      of: [defineArrayMember({ type: 'contentFeatureItem' })],
      group: 'content',
      hidden: ({ parent }) => parent?.variant !== 'simple',
    }),
    defineField({
      name: 'iconFeatures',
      title: 'Icon features',
      type: 'array',
      description:
        'Up to 2 features, each with an icon, heading, and description.',
      of: [defineArrayMember({ type: 'contentIconFeature' })],
      group: 'content',
      validation: (Rule) => Rule.max(2),
      hidden: ({ parent }) => parent?.variant !== 'icons-featured-image',
    }),
    defineField({
      name: 'checklistItems',
      title: 'Checklist items',
      type: 'text',
      description:
        'Type one item per line. Each line becomes a tick-mark item on the page.',
      group: 'content',
      hidden: ({ parent }) => parent?.variant !== 'alternating',
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      description:
        'Recommended: at least 800 × 600 px. Use the hotspot to control the focal point when cropped.',
      options: { hotspot: true },
      group: 'content',
      hidden: ({ parent }) =>
        parent?.variant !== 'alternating' &&
        parent?.variant !== 'icons-featured-image',
    }),
    defineField({
      name: 'imagePosition',
      title: 'Image position',
      type: 'string',
      description:
        'Automatic: alternates with previous alternating-content sections on the page (first one starts on the right). Use Left or Right to override; following Automatic sections will continue alternating from your chosen side.',
      options: {
        list: [
          { title: 'Automatic', value: 'auto' },
          { title: 'Left', value: 'left' },
          { title: 'Right', value: 'right' },
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: 'auto',
      group: 'settings',
      hidden: ({ parent }) => parent?.variant !== 'alternating',
    }),
    defineField({
      name: 'imageLayout',
      title: 'Image layout',
      type: 'string',
      description:
        'How the image and content card are arranged. Inline separated: text on one side, image card on the other. Inline overlapping: image fills the container, content card sits over it on one side. Full-bleed: image spans the full viewport width with the content card overlaid.',
      options: {
        list: [
          { title: 'Inline, separated', value: 'inline-separated' },
          { title: 'Inline, overlapping', value: 'inline-overlapping' },
          { title: 'Full-bleed', value: 'full-bleed' },
        ],
        layout: 'radio',
        direction: 'vertical',
      },
      initialValue: 'inline-separated',
      group: 'settings',
      hidden: ({ parent }) => parent?.variant !== 'alternating',
    }),
    defineField({
      name: 'align',
      title: 'Text alignment',
      type: 'string',
      options: {
        list: [
          { title: 'Left', value: 'left' },
          { title: 'Centre', value: 'center' },
        ],
      },
      initialValue: 'left',
      group: 'settings',
      hidden: ({ parent }) => parent?.variant !== 'title',
    }),
    defineField({
      name: 'dark',
      title: 'Dark background',
      type: 'boolean',
      description:
        'Turn this on to show the section with a dark background and light text.',
      initialValue: false,
      group: 'settings',
    }),
  ],
  preview: {
    select: { title: 'heading', subtitle: 'variant' },
    prepare: ({ title, subtitle }) => ({
      title: title || 'Content Section',
      subtitle: subtitle,
    }),
  },
});

export default null;
