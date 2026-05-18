import { defineType, defineField } from 'sanity';

/**
 * Instagram Feed Section — pulls the latest posts from the Instagram
 * account configured by the `INSTAGRAM_ACCESS_TOKEN` env var. The
 * public handle for the "View on Instagram" link is configured once
 * in Site Settings → General → Instagram handle.
 */
export const instagramFeedSection = defineType({
  name: 'instagramFeedSection',
  title: 'Instagram Feed Section',
  type: 'object',
  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Tag line (optional)',
      type: 'string',
      description:
        'A short label shown in small text above the heading (e.g. "Instagram"). Leave blank to hide.',
    }),
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'subCopy',
      title: 'Supporting text (optional)',
      type: 'text',
      rows: 3,
      description:
        'A short paragraph shown below the heading. Leave blank to hide.',
    }),
    defineField({
      name: 'viewAllLabel',
      title: '"Follow" button text',
      type: 'string',
      description: 'Label for the button that links to the Instagram profile.',
      initialValue: 'Follow on Instagram',
    }),
  ],
  preview: {
    select: { title: 'heading' },
    prepare: ({ title }) => ({ title: title || 'Instagram Feed Section' }),
  },
});

export default null;
