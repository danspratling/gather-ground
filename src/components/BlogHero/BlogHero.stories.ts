import type { Meta } from '@storybook/types';
import type { BlogHeroProps } from './BlogHero.types';

export default {
  title: 'Page Sections/BlogHero',
  component: 'BlogHero',
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/zsTOcot4CKA5nq2ihg0ZLi/Gather-Ground-Website?node-id=1624-472083',
    },
    chromatic: { viewports: [375, 1440] },
  },
} satisfies Meta;

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
