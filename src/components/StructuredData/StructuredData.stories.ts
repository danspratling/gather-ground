// @storybook-astro/framework does not export Meta/StoryObj — Astro stories are untyped by design.

import StructuredData from './StructuredData.astro';

const meta = {
  title: 'SEO/StructuredData',
  component: StructuredData,
  parameters: {},
};

export default meta;

export const WebPage = {
  args: {
    data: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Gather Ground',
      url: 'https://gatherground.co.uk',
      description: 'Family farm in rural Iowa.',
    },
  },
};

export const BlogPosting = {
  args: {
    data: {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: 'Heritage Breed Farming',
      url: 'https://gatherground.co.uk/blog/heritage-breed-farming',
      datePublished: '2024-01-01',
      author: { '@type': 'Person', name: 'Jane Doe' },
    },
  },
};

export const Organization = {
  args: {
    data: {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Gather Ground',
      url: 'https://gatherground.co.uk',
    },
  },
};
