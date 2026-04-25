import { defineType, defineField, defineArrayMember } from 'sanity';

/** Callout block — embeddable in Portable Text body fields. */
export const callout = defineType({
  name: 'callout',
  title: 'Callout',
  type: 'object',
  fields: [
    defineField({
      name: 'content',
      title: 'Content',
      type: 'array',
      of: [defineArrayMember({ type: 'block' })],
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    prepare: () => ({ title: 'Callout' }),
  },
});

export default null;
