// @storybook-astro/framework does not export Meta/StoryObj — Astro stories are untyped by design.
// See: https://storybook-astro.org/writing-stories/
import { expect, within } from 'storybook/test';

// @ts-expect-error — .astro files have no TypeScript declarations
import BlogCard from '@/components/BlogCard.astro';

const meta = {
  title: 'Core/Blog Card',
  component: BlogCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    a11y: { disable: false },
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/zsTOcot4CKA5nq2ihg0ZLi/Gather-Ground-Website?node-id=5050-372076',
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['homepage', 'index'],
    },
  },
};

export default meta;

const defaultArgs = {
  image:
    'https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=600&q=80',
  imageAlt: 'Rolling pasture at dawn',
  title: 'Why heritage breeds taste different — and why it matters',
  excerpt:
    'Modern commodity pork has been bred for leanness and fast growth. Heritage breeds like Berkshire and Duroc are slower-growing and fattier — and that fat is where the flavour lives.',
  date: '28 Mar 2026',
  authorName: 'Dan Spratling',
  authorImage: 'https://i.pravatar.cc/150?img=3',
  authorImageAlt: 'Dan Spratling',
  href: '/blog/why-heritage-breeds-taste-different',
};

export const HomepageCard = {
  args: {
    ...defaultArgs,
    variant: 'homepage' as const,
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByText(
        'Why heritage breeds taste different — and why it matters'
      )
    ).toBeInTheDocument();
    await expect(canvas.getByText('Dan Spratling')).toBeInTheDocument();
    await expect(canvas.getByText('28 Mar 2026')).toBeInTheDocument();
    await expect(
      canvas.getByRole('link', {
        name: 'Why heritage breeds taste different — and why it matters',
      })
    ).toBeInTheDocument();
  },
};

export const IndexCard = {
  args: {
    ...defaultArgs,
    variant: 'index' as const,
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByText(
        'Why heritage breeds taste different — and why it matters'
      )
    ).toBeInTheDocument();
  },
};
