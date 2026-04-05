// @storybook-astro/framework does not export Meta/StoryObj — Astro stories are untyped by design.
// See: https://storybook-astro.org/writing-stories/
import { expect, within } from 'storybook/test';

// @ts-expect-error — .astro files have no TypeScript declarations
import HeroSection from '@/components/HeroSection/HeroSection.astro';

const meta = {
  title: 'Sections/Hero Section',
  component: HeroSection,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    a11y: { disable: false },
    chromatic: { viewports: [375, 1440] },
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/zsTOcot4CKA5nq2ihg0ZLi/Gather-Ground-Website?node-id=1647-388494',
    },
  },
};

export default meta;

export const Default = {
  args: {
    headline: 'We are Gather Ground lorem ipsum dolor sit amet',
    subCopy:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.',
    primaryCta: {
      label: 'Our Products',
      href: '/products',
    },
    secondaryCta: {
      label: 'Get in touch',
      href: '/contact',
    },
    image: {
      src: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=1216&h=516&fit=crop',
      alt: 'Gather Ground — a person in a creative workspace',
    },
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('heading', { level: 1 })).toBeInTheDocument();
    await expect(
      canvas.getByRole('link', { name: 'Our Products' })
    ).toBeInTheDocument();
    await expect(
      canvas.getByRole('link', { name: 'Get in touch' })
    ).toBeInTheDocument();
    await expect(canvas.getByRole('img')).toHaveAttribute('alt');
  },
};
