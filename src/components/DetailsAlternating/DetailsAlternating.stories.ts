// @storybook-astro/framework does not export Meta/StoryObj — Astro stories are untyped by design.
// See: https://storybook-astro.org/writing-stories/

// @ts-expect-error — .astro files have no TypeScript declarations
import DetailsAlternating from '@/components/DetailsAlternating/DetailsAlternating.astro';

const mockProps = {
  icon: 'MessageChatCircle',
  heading: 'Share team inboxes',
  body: 'Whether you have a team of 2 or 200, our shared team inboxes keep everyone on the same page and in the loop.',
  checklistItems: [
    'Leverage automation to move fast',
    'Always give customers a human to chat to',
    'Automate customer support and close leads faster',
  ],
  image: {
    src: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=640&h=480&fit=crop',
    alt: 'Modern workspace with computer',
  },
};

const meta = {
  title: 'Sections/DetailsAlternating',
  component: DetailsAlternating,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    a11y: { disable: false },
    chromatic: { viewports: [375, 1440] },
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/zsTOcot4CKA5nq2ihg0ZLi/Gather-Ground-Website?node-id=1344-4',
    },
  },
};

export default meta;

export const Default = {
  args: {
    ...mockProps,
    imagePosition: 'right' as const,
    dark: false,
  },
};

export const ImageLeft = {
  args: {
    ...mockProps,
    imagePosition: 'left' as const,
    dark: false,
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/zsTOcot4CKA5nq2ihg0ZLi/Gather-Ground-Website?node-id=18874-95865',
    },
  },
};

export const Dark = {
  args: {
    ...mockProps,
    imagePosition: 'right' as const,
    dark: true,
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/zsTOcot4CKA5nq2ihg0ZLi/Gather-Ground-Website?node-id=18874-95971',
    },
  },
};

export const Mobile = {
  args: {
    ...mockProps,
    imagePosition: 'right' as const,
    dark: false,
  },
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
    chromatic: { viewports: [375] },
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/zsTOcot4CKA5nq2ihg0ZLi/Gather-Ground-Website?node-id=1344-5',
    },
  },
};
