// @storybook-astro/framework does not export Meta/StoryObj — Astro stories are untyped by design.
// See: https://storybook-astro.org/writing-stories/
import type { PostHeaderProps } from './PostHeader.types';

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

const mockBody: PostHeaderProps['body'] = [
  {
    _type: 'block',
    _key: 'h1',
    style: 'h2',
    children: [{ _type: 'span', _key: 's1', text: 'Introduction', marks: [] }],
    markDefs: [],
  },
  {
    _type: 'block',
    _key: 'p1',
    style: 'normal',
    children: [
      {
        _type: 'span',
        _key: 's2',
        text: 'Mi tincidunt elit, id quisque ligula ac diam, amet. Vel etiam suspendisse morbi eleifend faucibus eget vestibulum felis. Dictum quis montes, sit sit.',
        marks: [],
      },
    ],
    markDefs: [],
  },
  {
    _type: 'block',
    _key: 'q1',
    style: 'blockquote',
    children: [
      {
        _type: 'span',
        _key: 's3',
        text: '"In a world older and more complete than ours they move finished and complete, gifted with extensions of the senses we have lost or never attained." — Olivia Rhye, Product Designer',
        marks: [],
      },
    ],
    markDefs: [],
  },
  {
    _type: 'block',
    _key: 'h2',
    style: 'h3',
    children: [
      { _type: 'span', _key: 's4', text: 'Software and tools', marks: [] },
    ],
    markDefs: [],
  },
  {
    _type: 'block',
    _key: 'p2',
    style: 'normal',
    children: [
      {
        _type: 'span',
        _key: 's5',
        text: 'Dolor enim eu tortor urna sed duis nulla. Aliquam vestibulum, nulla odio nisl vitae.',
        marks: [],
      },
    ],
    markDefs: [],
  },
  {
    _type: 'block',
    _key: 'li1',
    style: 'normal',
    listItem: 'number',
    level: 1,
    children: [
      {
        _type: 'span',
        _key: 's6',
        text: 'Lectus id duis vitae porttitor enim.',
        marks: [],
      },
    ],
    markDefs: [],
  },
  {
    _type: 'block',
    _key: 'li2',
    style: 'normal',
    listItem: 'number',
    level: 1,
    children: [
      {
        _type: 'span',
        _key: 's7',
        text: 'Eu turpis posuere semper feugiat volutpat elit.',
        marks: [],
      },
    ],
    markDefs: [],
  },
  {
    _type: 'block',
    _key: 'li3',
    style: 'normal',
    listItem: 'number',
    level: 1,
    children: [
      {
        _type: 'span',
        _key: 's8',
        text: 'Suspendisse maecenas ac donec scelerisque diam.',
        marks: [],
      },
    ],
    markDefs: [],
  },
];

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
