// @storybook-astro/framework does not export Meta/StoryObj — Astro stories are untyped by design.
// See: https://storybook-astro.org/writing-stories/
import { expect, within } from 'storybook/test';

import BlogSection from '@/components/BlogSection/BlogSection.astro';

const meta = {
  title: 'Sections/Blog Section',
  component: BlogSection,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    a11y: { disable: false },
    chromatic: { viewports: [375, 1440] },
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/zsTOcot4CKA5nq2ihg0ZLi/Gather-Ground-Website?node-id=5050-372076',
    },
  },
};

export default meta;

const defaultPosts = [
  {
    image:
      'https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=600&q=80',
    imageAlt: 'Rolling pasture at dawn',
    title: "What we've been working on recently",
    excerpt:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.',
    date: '20 Jan 2025',
    authorName: 'Claire',
    authorImage:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face',
    authorImageAlt: 'Claire',
    href: '/blog/what-we-have-been-working-on',
  },
  {
    image:
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80',
    imageAlt: 'Pork joints on a wooden board',
    title: 'Pork joints are back!',
    excerpt:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.',
    date: '19 Jan 2025',
    authorName: 'Kevin',
    authorImage:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face',
    authorImageAlt: 'Kevin',
    href: '/blog/pork-joints-are-back',
  },
  {
    image:
      'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=600&q=80',
    imageAlt: 'Green regenerative farmland',
    title: 'Moving to regenerative farming',
    excerpt:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.',
    date: '18 Jan 2025',
    authorName: 'Kevin',
    authorImage:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face',
    authorImageAlt: 'Kevin',
    href: '/blog/moving-to-regenerative-farming',
  },
];

export const Default = {
  args: {
    eyebrow: 'News',
    heading: "What's new on the farm",
    subCopy: "Updates on everything we're doing and why, so you never miss out",
    viewAllHref: '/blog',
    viewAllLabel: 'View all updates',
    posts: defaultPosts,
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement);

    // Heading is visible
    await expect(
      canvas.getByRole('heading', { name: "What's new on the farm" })
    ).toBeInTheDocument();

    // View all link is present
    await expect(
      canvas.getByRole('link', { name: 'View all updates' })
    ).toBeInTheDocument();

    // All 3 post titles are visible
    await expect(
      canvas.getByText("What we've been working on recently")
    ).toBeInTheDocument();
    await expect(canvas.getByText('Pork joints are back!')).toBeInTheDocument();
    await expect(
      canvas.getByText('Moving to regenerative farming')
    ).toBeInTheDocument();
  },
};
