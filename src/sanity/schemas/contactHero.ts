import { defineType, defineField } from 'sanity';

/** Contact Hero — page section object with form + map. */
export const contactHero = defineType({
  name: 'contactHero',
  title: 'Contact Hero',
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
      title: 'Description (optional)',
      type: 'text',
      rows: 3,
      description:
        'A short paragraph shown below the heading. Leave blank to hide.',
    }),
    defineField({
      name: 'mapEmbedUrl',
      title: 'Google Maps embed link',
      type: 'url',
      description:
        'To get this: open Google Maps → find the location → click Share → Embed a map → copy the URL from the src="…" part of the code.',
      validation: (Rule) =>
        Rule.required()
          .uri({ scheme: ['https'] })
          .custom((val) => {
            if (!val) return true;
            if (val.startsWith('https://www.google.com/maps/embed'))
              return true;
            return 'This must be a Google Maps embed link (starts with https://www.google.com/maps/embed…)';
          }),
    }),
    defineField({
      name: 'mapTitle',
      title: 'Map label for screen readers',
      type: 'string',
      description:
        'A short description of what the map shows, for visitors using screen readers (e.g. "Our farm location").',
      initialValue: 'Our location',
    }),
  ],
  preview: {
    select: { title: 'heading' },
    prepare: ({ title }) => ({ title: title || 'Contact Hero' }),
  },
});

export default null;
