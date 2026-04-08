// @storybook-astro/framework does not export Meta/StoryObj — Astro stories are untyped by design.
import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from 'storybook/test';

import BlogGrid from '@/components/BlogGrid/BlogGrid';

const meta = {
  title: 'Blog/Blog Grid',
  component: BlogGrid,
  tags: ['autodocs'],
  parameters: {
    renderer: 'react',
    layout: 'padded',
    a11y: { disable: false },
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/zsTOcot4CKA5nq2ihg0ZLi/Gather-Ground-Website?node-id=1624-472083',
    },
    chromatic: { viewports: [375, 1440] },
  },
} satisfies Meta<typeof BlogGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

const cardImages = [
  'https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=600&q=80',
  'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80',
  'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=600&q=80',
];

const authorImages = [
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face',
];

const mockPosts = Array.from({ length: 9 }, (_, i) => ({
  image: cardImages[i % cardImages.length],
  imageAlt: `Farm landscape ${i + 1}`,
  title: `Why heritage breeds matter — post ${i + 1}`,
  excerpt:
    'Modern commodity pork has been bred for leanness. Heritage breeds are slower-growing and fattier — that fat is where the flavour lives.',
  date: '28 Mar 2026',
  authorName: 'Dan Spratling',
  authorImage: authorImages[i % authorImages.length],
  authorImageAlt: 'Dan Spratling',
  href: `/blog/heritage-breeds-${i + 1}`,
  slug: `heritage-breeds-${i + 1}`,
  categories:
    i % 3 === 0
      ? ['Design']
      : i % 3 === 1
        ? ['Product']
        : ['Software Engineering'],
}));

export const Default: Story = {
  args: {
    posts: mockPosts,
    initialVisibleCount: 6,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const loadMoreBtn = canvas.getByRole('button', { name: /load more/i });
    expect(loadMoreBtn).toBeInTheDocument();
    await userEvent.click(loadMoreBtn);
    // After clicking, all 9 should be visible — no load more button
    expect(canvas.queryByRole('button', { name: /load more/i })).toBeNull();
  },
};

export const EmptyState: Story = {
  args: {
    posts: [],
    initialVisibleCount: 6,
  },
};

export const FewPosts: Story = {
  args: {
    posts: mockPosts.slice(0, 3),
    initialVisibleCount: 6,
  },
};
