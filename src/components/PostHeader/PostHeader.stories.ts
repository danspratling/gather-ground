// @storybook-astro/framework does not export Meta/StoryObj — Astro stories are untyped by design.
// See: https://storybook-astro.org/writing-stories/
import type { PostHeaderProps } from './PostHeader.types';

// @ts-expect-error — .astro files have no TypeScript declarations
import PostHeader from '@/components/PostHeader/PostHeader.astro';

const meta = {
  title: 'Sections (Unique)/PostHeader',
  component: PostHeader,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    a11y: { disable: false },
    chromatic: { viewports: [375, 1440] },
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/zsTOcot4CKA5nq2ihg0ZLi/Gather-Ground-Website?node-id=1639-286662',
    },
  },
};

export default meta;

const mockBody: PostHeaderProps['body'] = {
  type: 'doc',
  content: [
    {
      type: 'heading',
      attrs: { level: 2 },
      content: [{ type: 'text', text: 'Introduction' }],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'Mi tincidunt elit, id quisque ligula ac diam, amet. Vel etiam suspendisse morbi eleifend faucibus eget vestibulum felis. Dictum quis montes, sit sit. Tellus aliquam enim urna, etiam. Mauris posuere vulputate arcu amet, vitae nisi, tellus tincidunt.',
        },
      ],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'Eget quis mi enim, leo lacinia pharetra, semper. Eget in volutpat mollis at volutpat lectus velit, sed auctor. Porttitor fames arcu quis fusce augue enim.',
        },
      ],
    },
    {
      type: 'blockquote',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: '"In a world older and more complete than ours they move finished and complete, gifted with extensions of the senses we have lost or never attained, living by voices we shall never hear."',
            },
          ],
        },
        {
          type: 'paragraph',
          content: [{ type: 'text', text: '— Olivia Rhye, Product Designer' }],
        },
      ],
    },
    {
      type: 'heading',
      attrs: { level: 3 },
      content: [{ type: 'text', text: 'Software and tools' }],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'Dolor enim eu tortor urna sed duis nulla. Aliquam vestibulum, nulla odio nisl vitae. In aliquet pellentesque aenean hac vestibulum turpis mi bibendum diam. Tempor integer aliquam in vitae malesuada fringilla.',
        },
      ],
    },
    {
      type: 'ordered_list',
      content: [
        {
          type: 'list_item',
          content: [
            {
              type: 'paragraph',
              content: [
                { type: 'text', text: 'Lectus id duis vitae porttitor enim.' },
              ],
            },
          ],
        },
        {
          type: 'list_item',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'Eu turpis posuere semper feugiat volutpat elit.',
                },
              ],
            },
          ],
        },
        {
          type: 'list_item',
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'Suspendisse maecenas ac donec scelerisque diam.',
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

export const Default = {
  args: {
    publishedDate: 'Published 20 Jan 2025',
    title: 'UX review presentations',
    excerpt:
      'How do you create compelling presentations that wow your colleagues and impress your managers? Find out with our in-depth guide on UX presentations.',
    categories: ['Design', 'Research', 'Presentation'],
    heroImage:
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=1216&q=80',
    heroImageAlt: 'Person giving a UX presentation',
    body: mockBody,
    authorName: 'Olivia Rhye',
    authorAvatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&fit=crop&crop=face',
    authorAvatarAlt: 'Olivia Rhye',
    authorRole: 'Product Designer',
  } satisfies PostHeaderProps,
};

export const MinimalCategories = {
  args: {
    publishedDate: 'Published 8 Apr 2026',
    title: 'Moving to regenerative farming',
    excerpt:
      'We made the switch to regenerative farming three years ago. This is what we learned along the way.',
    categories: ['Farming'],
    heroImage:
      'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1216&q=80',
    heroImageAlt: 'Green regenerative farmland',
    body: mockBody,
    authorName: 'Kevin',
    authorAvatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=96&h=96&fit=crop&crop=face',
    authorAvatarAlt: 'Kevin',
    authorRole: 'Farm Owner',
  } satisfies PostHeaderProps,
};
