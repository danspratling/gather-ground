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
      title: 'Avatar',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'role',
      title: 'Role / title',
      type: 'string',
    }),
  ],
  preview: {
    select: { title: 'name', media: 'avatar' },
  },
});

export default null;
