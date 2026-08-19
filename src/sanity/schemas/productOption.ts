import { defineType, defineField } from 'sanity';

/**
 * A named product option dimension (e.g. Cut, Size, Style).
 *
 * Shared across all products so the same option name is always spelled
 * consistently. Variants reference these documents rather than storing
 * the name as free text, preventing "Cut" vs "Cuts" drift.
 */
export const productOption = defineType({
  name: 'productOption',
  title: 'Product Option',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      description: 'The option dimension name, e.g. Cut, Size, Style.',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: { title: 'name' },
  },
});

export default null;
