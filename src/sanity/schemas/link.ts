import { defineType } from 'sanity';

/**
 * Reusable link object — replaces Storyblok multilink.
 * Supports internal references, external URLs, and email links.
 */
export const link = defineType({
  name: 'link',
  title: 'Link',
  type: 'object',
  fields: [
    {
      name: 'type',
      title: 'Type',
      type: 'string',
      options: {
        list: [
          { title: 'URL', value: 'url' },
          { title: 'Internal page', value: 'internal' },
          { title: 'Email', value: 'email' },
          { title: 'Anchor', value: 'anchor' },
        ],
        layout: 'radio',
      },
      initialValue: 'url',
    },
    {
      name: 'url',
      title: 'URL',
      type: 'url',
      validation: (Rule) =>
        Rule.uri({ allowRelative: true, scheme: ['http', 'https'] }),
      hidden: ({ parent }) => parent?.type !== 'url',
    },
    {
      name: 'internalLink',
      title: 'Internal page',
      type: 'reference',
      to: [{ type: 'pages' }, { type: 'blogPosts' }],
      hidden: ({ parent }) => parent?.type !== 'internal',
    },
    {
      name: 'email',
      title: 'Email address',
      type: 'string',
      hidden: ({ parent }) => parent?.type !== 'email',
    },
    {
      name: 'anchor',
      title: 'Anchor ID',
      type: 'string',
      description:
        'The ID of the section to scroll to, without the # (e.g. "about-us")',
      hidden: ({ parent }) => parent?.type !== 'anchor',
    },
  ],
});

export default null;
