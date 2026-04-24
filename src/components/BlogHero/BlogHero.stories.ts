// @storybook-astro/framework does not export Meta/StoryObj — Astro stories are untyped by design.
// See: https://storybook-astro.org/writing-stories/
import type { BlogHeroProps } from './BlogHero.types';

import BlogHero from '@/components/BlogHero/BlogHero.astro';

export default {
  title: 'Sections (Unique)/BlogHero',
  component: BlogHero,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    a11y: { disable: false },
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/zsTOcot4CKA5nq2ihg0ZLi/Gather-Ground-Website?node-id=1624-472083',
    },
    chromatic: { viewports: [375, 1440] },
  },
};

export const WithEmailCapture = {
  args: {
    eyebrow: 'Blog',
    heading: 'Resource library',
    subCopy:
      'Subscribe to learn about new product features, the latest in technology, solutions, and updates.',
    privacyPolicyHref: '/privacy',
  } satisfies BlogHeroProps,
};

export const WithoutEmailCapture = {
  args: {
    eyebrow: 'Blog',
    heading: 'Resource library',
    subCopy:
      'Subscribe to learn about new product features, the latest in technology, solutions, and updates.',
  } satisfies BlogHeroProps,
};
