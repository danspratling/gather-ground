// @storybook-astro/framework does not export Meta/StoryObj — Astro stories are untyped by design.
import { expect, within } from 'storybook/test';
import type { RichTextProps } from './RichText.types';

import RichText from '@/components/RichText/RichText.astro';

const meta = {
  title: 'Blog/RichText',
  component: RichText,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    a11y: { disable: false },
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/zsTOcot4CKA5nq2ihg0ZLi/Gather-Ground-Website?node-id=1639-286198',
    },
  },
};

export default meta;

const richContent: RichTextProps['content'] = [
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
        text: 'Mi tincidunt elit, id quisque ligula ac diam, amet. Vel etiam suspendisse morbi eleifend faucibus eget vestibulum felis.',
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
      { _type: 'span', _key: 's3', text: 'Software and tools', marks: [] },
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
        _key: 's4',
        text: 'Dolor enim eu tortor urna sed duis nulla. Aliquam vestibulum, nulla odio nisl vitae.',
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
        _key: 's5',
        text: '"In a world older and more complete than ours they move finished and complete, gifted with extensions of the senses we have lost or never attained." — Olivia Rhye, Product Designer',
        marks: [],
      },
    ],
    markDefs: [],
  },
  {
    _type: 'block',
    _key: 'h3',
    style: 'h3',
    children: [
      { _type: 'span', _key: 's6', text: 'Other resources', marks: [] },
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
        _key: 's7',
        text: 'Lectus id duis vitae porttitor enim gravida morbi.',
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
        _key: 's8',
        text: 'Eu turpis posuere semper feugiat volutpat elit, ultrices suspendisse.',
        marks: [],
      },
    ],
    markDefs: [],
  },
  {
    _type: 'block',
    _key: 'li3',
    style: 'normal',
    listItem: 'bullet',
    level: 1,
    children: [
      {
        _type: 'span',
        _key: 's9',
        text: 'Pasture-raised heritage breeds',
        marks: [],
      },
    ],
    markDefs: [],
  },
  {
    _type: 'block',
    _key: 'li4',
    style: 'normal',
    listItem: 'bullet',
    level: 1,
    children: [
      {
        _type: 'span',
        _key: 's10',
        text: 'No antibiotics or hormones',
        marks: [],
      },
    ],
    markDefs: [],
  },
];

export const Default = {
  args: {
    content: richContent,
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement);
    const h2 = canvas.getByRole('heading', { level: 2 });
    const h3s = canvas.getAllByRole('heading', { level: 3 });

    expect(h2).toBeTruthy();
    expect(h3s.length).toBeGreaterThanOrEqual(1);
    expect(
      h2.compareDocumentPosition(h3s[0]) & Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy();
  },
};

export const WithCallout = {
  args: {
    content: [
      {
        _type: 'block',
        _key: 'h1',
        style: 'h2',
        children: [
          {
            _type: 'span',
            _key: 's1',
            text: 'Featured block types',
            marks: [],
          },
        ],
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
            text: 'Below you will find a callout block demonstrating the supported richtext block type.',
            marks: [],
          },
        ],
        markDefs: [],
      },
      {
        _type: 'callout',
        _key: 'c1',
        content: [
          {
            _type: 'block',
            _key: 'ch1',
            style: 'h3',
            children: [
              { _type: 'span', _key: 'cs1', text: 'Did you know?', marks: [] },
            ],
            markDefs: [],
          },
          {
            _type: 'block',
            _key: 'cp1',
            style: 'normal',
            children: [
              {
                _type: 'span',
                _key: 'cs2',
                text: 'Heritage breed animals raised on pasture produce meat with significantly higher levels of omega-3 fatty acids and CLA compared to conventionally raised animals.',
                marks: [],
              },
            ],
            markDefs: [],
          },
        ],
      },
    ] as RichTextProps['content'],
  },
};
