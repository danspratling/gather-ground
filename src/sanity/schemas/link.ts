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
      title: 'Link type',
      type: 'string',
      description: 'Choose how this link should work.',
      options: {
        list: [
          { title: 'Web address (URL)', value: 'url' },
          { title: 'Page on this site', value: 'internal' },
          { title: 'Email address', value: 'email' },
          { title: 'Jump to section', value: 'anchor' },
        ],
        layout: 'radio',
      },
      initialValue: 'url',
    },
    {
      name: 'url',
      title: 'Web address',
      type: 'url',
      description:
        'Full URL including https:// — or a relative path like /about.',
      validation: (Rule) =>
        Rule.uri({ allowRelative: true, scheme: ['http', 'https'] }),
      hidden: ({ parent }) => parent?.type !== 'url',
    },
    {
      name: 'internalLink',
      title: 'Page on this site',
      type: 'reference',
      description: 'Pick an existing page. The URL is generated automatically.',
      to: [
        { type: 'pages' },
        { type: 'blogPosts' },
        { type: 'blogPage' },
        { type: 'productPage' },
        { type: 'products' },
      ],
      hidden: ({ parent }) => parent?.type !== 'internal',
    },
    {
      name: 'email',
      title: 'Email address',
      type: 'string',
      description: 'e.g. hello@gatherground.co.uk',
      hidden: ({ parent }) => parent?.type !== 'email',
    },
    {
      name: 'anchor',
      title: 'Section to jump to',
      type: 'string',
      description:
        'The section name to scroll to — without the # symbol (e.g. "about-us"). Ask a developer if you\'re unsure of the section name.',
      hidden: ({ parent }) => parent?.type !== 'anchor',
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const parent = context.parent as { type?: string } | undefined;
          if (parent?.type !== 'anchor') return true;
          if (typeof value !== 'string' || value.trim() === '') {
            return 'Anchor ID is required when link type is Anchor';
          }
          if (value.trim().startsWith('#')) {
            return 'Anchor ID must not start with #';
          }
          return true;
        }),
    },
  ],
});

export default null;
