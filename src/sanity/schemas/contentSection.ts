import { defineType, defineField, defineArrayMember } from 'sanity';

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
      title: 'Body',
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
      title: 'Icon name',
      type: 'string',
      description:
        'Name of icon from @untitledui-pro/icons/line (e.g. MessageChatCircle)',
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
  fields: [
    defineField({
      name: 'variant',
      title: 'Variant',
      type: 'string',
      options: {
        list: [
          { title: 'Simple', value: 'simple' },
          { title: 'Alternating', value: 'alternating' },
          { title: 'Icons with Featured Image', value: 'icons-featured-image' },
          { title: 'Title', value: 'title' },
        ],
      },
      initialValue: 'simple',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow',
      type: 'string',
      hidden: ({ parent }) =>
        parent?.variant !== 'icons-featured-image' &&
        parent?.variant !== 'title',
    }),
    defineField({
      name: 'icon',
      title: 'Icon name',
      type: 'string',
      description:
        'Name of icon from @untitledui-pro/icons/line (e.g. ZapFast)',
      hidden: ({ parent }) =>
        parent?.variant !== 'simple' && parent?.variant !== 'alternating',
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
      name: 'features',
      title: 'Features',
      type: 'array',
      of: [defineArrayMember({ type: 'contentFeatureItem' })],
      hidden: ({ parent }) => parent?.variant !== 'simple',
    }),
    defineField({
      name: 'iconFeatures',
      title: 'Icon Features',
      type: 'array',
      of: [defineArrayMember({ type: 'contentIconFeature' })],
      validation: (Rule) => Rule.max(2),
      hidden: ({ parent }) => parent?.variant !== 'icons-featured-image',
    }),
    defineField({
      name: 'checklistItems',
      title: 'Checklist items',
      type: 'text',
      description: 'One item per line. Each line becomes a checklist entry.',
      hidden: ({ parent }) => parent?.variant !== 'alternating',
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: { hotspot: true },
      hidden: ({ parent }) =>
        parent?.variant !== 'alternating' &&
        parent?.variant !== 'icons-featured-image',
    }),
    defineField({
      name: 'imagePosition',
      title: 'Image position',
      type: 'string',
      options: {
        list: [
          { title: 'Left', value: 'left' },
          { title: 'Right', value: 'right' },
        ],
      },
      initialValue: 'right',
      hidden: ({ parent }) => parent?.variant !== 'alternating',
    }),
    defineField({
      name: 'align',
      title: 'Alignment',
      type: 'string',
      options: {
        list: [
          { title: 'Left', value: 'left' },
          { title: 'Center', value: 'center' },
        ],
      },
      initialValue: 'left',
      hidden: ({ parent }) => parent?.variant !== 'title',
    }),
    defineField({
      name: 'dark',
      title: 'Dark variant',
      type: 'boolean',
      initialValue: false,
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
