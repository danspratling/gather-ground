// @storybook-astro/framework does not export Meta/StoryObj — Astro stories are untyped by design.
// See: https://storybook-astro.org/writing-stories/
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

const richContent: RichTextProps['content'] = {
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
          text: 'Mi tincidunt elit, id quisque ligula ac diam, amet. Vel etiam suspendisse morbi eleifend faucibus eget vestibulum felis. Dictum quis montes, sit sit. Tellus aliquam enim urna, etiam.',
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
      type: 'heading',
      attrs: { level: 3 },
      content: [{ type: 'text', text: 'Software and tools' }],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'Dolor enim eu tortor urna sed duis nulla. Aliquam vestibulum, nulla odio nisl vitae. In aliquet pellentesque aenean hac vestibulum turpis mi bibendum diam.',
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
              text: '"In a world older and more complete than ours they move finished and complete, gifted with extensions of the senses we have lost or never attained."',
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
      content: [{ type: 'text', text: 'Other resources' }],
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'Sagittis et eu at elementum, quis in. Proin praesent volutpat egestas sociis sit lorem nunc nunc sit.',
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
                {
                  type: 'text',
                  text: 'Lectus id duis vitae porttitor enim gravida morbi.',
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
                  text: 'Eu turpis posuere semper feugiat volutpat elit, ultrices suspendisse.',
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
                  text: 'Suspendisse maecenas ac donec scelerisque diam sed est duis purus.',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      type: 'bullet_list',
      content: [
        {
          type: 'list_item',
          content: [
            {
              type: 'paragraph',
              content: [
                { type: 'text', text: 'Pasture-raised heritage breeds' },
              ],
            },
          ],
        },
        {
          type: 'list_item',
          content: [
            {
              type: 'paragraph',
              content: [{ type: 'text', text: 'No antibiotics or hormones' }],
            },
          ],
        },
      ],
    },
  ],
};

export const Default = {
  args: {
    content: richContent,
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement);

    // Heading hierarchy: H2 appears before H3, no skipped levels
    const h2 = canvas.getByRole('heading', { level: 2 });
    const h3s = canvas.getAllByRole('heading', { level: 3 });

    expect(h2).toBeTruthy();
    expect(h3s.length).toBeGreaterThanOrEqual(1);

    // H2 should appear before the first H3 in the DOM
    expect(
      h2.compareDocumentPosition(h3s[0]) & Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy();
  },
};

export const WithCalloutAndImage = {
  args: {
    content: {
      type: 'doc',
      content: [
        {
          type: 'heading',
          attrs: { level: 2 },
          content: [{ type: 'text', text: 'Featured block types' }],
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Below you will find a callout block demonstrating the supported richtext block type.',
            },
          ],
        },
        {
          type: 'blok',
          attrs: {
            id: 'callout-01',
            body: [
              {
                component: 'callout',
                content: {
                  type: 'doc',
                  content: [
                    {
                      type: 'heading',
                      attrs: { level: 3 },
                      content: [{ type: 'text', text: 'Did you know?' }],
                    },
                    {
                      type: 'paragraph',
                      content: [
                        {
                          type: 'text',
                          text: 'Heritage breed animals raised on pasture produce meat with significantly higher levels of omega-3 fatty acids and conjugated linoleic acid (CLA) compared to conventionally raised animals.',
                        },
                      ],
                    },
                  ],
                },
              },
            ],
          },
        },
      ],
    } as RichTextProps['content'],
  },
};
