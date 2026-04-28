import { defineType, defineField } from 'sanity';

/** Authors document — referenced by blog posts. */
export const authors = defineType({
  name: 'authors',
  title: 'Authors',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'avatar',
      title: 'Photo',
      type: 'image',
      description:
        'A headshot or profile picture. Recommended: square, at least 200 × 200 px.',
      options: { hotspot: true },
    }),
    defineField({
      name: 'role',
      title: 'Role or title (optional)',
      type: 'string',
      description:
        'e.g. "Founder", "Head of Marketing". Shown below the name on blog posts.',
    }),
  ],
  preview: {
    select: { title: 'name', media: 'avatar' },
  },
});

export default null;
