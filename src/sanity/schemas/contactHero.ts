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
      title: 'Body text',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'mapEmbedUrl',
      title: 'Map embed URL',
      type: 'url',
      description:
        'Google Maps embed URL (from Share → Embed a map → copy src attribute)',
      validation: (Rule) =>
        Rule.uri({ scheme: ['https'] }).custom((val) => {
          if (!val) return true;
          if (val.startsWith('https://www.google.com/maps/embed')) return true;
          return 'Must be a Google Maps embed URL (https://www.google.com/maps/embed...)';
        }),
    }),
    defineField({
      name: 'mapTitle',
      title: 'Map title',
      type: 'string',
      description: 'Accessible label for the map iframe',
      initialValue: 'Our location',
    }),
  ],
  preview: {
    select: { title: 'heading' },
    prepare: ({ title }) => ({ title: title || 'Contact Hero' }),
  },
});

export default null;
