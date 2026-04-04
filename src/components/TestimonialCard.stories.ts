// @storybook-astro/framework does not export Meta/StoryObj — Astro stories are untyped by design.
// See: https://storybook-astro.org/writing-stories/
import { expect, within } from 'storybook/test';

// @ts-expect-error — .astro files have no TypeScript declarations
import TestimonialCard from '@/components/TestimonialCard.astro';

const meta = {
  title: 'Core/Testimonial Card',
  component: TestimonialCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    a11y: { disable: false },
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/zsTOcot4CKA5nq2ihg0ZLi/Gather-Ground-Website?node-id=1647-392096',
    },
  },
};

export default meta;

const defaultAuthor = {
  src: 'https://i.pravatar.cc/150?img=5',
  alt: 'Sarah M.',
  name: 'Sarah M.',
  secondary: '@sarahm',
  secondaryIsHandle: true,
};

export const Default = {
  args: {
    quote:
      'The beef shortribs were absolutely incredible. Best I've ever had — and that's coming from someone who grew up on a cattle farm.',
    author: defaultAuthor,
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByText(/The beef shortribs were absolutely incredible/)
    ).toBeInTheDocument();
    await expect(canvas.getByText('Sarah M.')).toBeInTheDocument();
  },
};

export const WithPlatform = {
  args: {
    quote:
      'Ordered the heritage pork bundle and was blown away. Ships fast, arrives perfectly packed. Highly recommend.',
    platform: 'instagram' as const,
    author: {
      src: 'https://i.pravatar.cc/150?img=8',
      alt: 'James R.',
      name: 'James R.',
      secondary: '@jamesr_eats',
      secondaryIsHandle: true,
    },
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('Instagram')).toBeInTheDocument();
    await expect(canvas.getByText('James R.')).toBeInTheDocument();
  },
};

export const WithDate = {
  args: {
    quote:
      'We've been ordering monthly for over a year. The quality never dips and the animals are clearly raised with care.',
    author: {
      src: 'https://i.pravatar.cc/150?img=12',
      alt: 'Emily T.',
      name: 'Emily T.',
      secondary: 'March 2026',
    },
  },
};
