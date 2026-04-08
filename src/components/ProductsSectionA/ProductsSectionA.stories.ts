// @storybook-astro/framework does not export Meta/StoryObj — Astro stories are untyped by design.
// See: https://storybook-astro.org/writing-stories/

// @ts-expect-error — .astro files have no TypeScript declarations
import ProductsSectionA from '@/components/ProductsSectionA/ProductsSectionA.astro';

const meta = {
  title: 'Sections/Products Section A',
  component: ProductsSectionA,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    a11y: { disable: false },
    chromatic: { viewports: [375, 1440] },
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/zsTOcot4CKA5nq2ihg0ZLi/Gather-Ground-Website?node-id=18580-6378',
    },
  },
};

export default meta;

const mockProducts = [
  {
    image:
      'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=384&h=256&fit=crop',
    imageAlt: 'A selection of beef cuts',
    title: 'Beef',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.',
    href: '/products/beef',
  },
  {
    image:
      'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=384&h=256&fit=crop',
    imageAlt: 'Pork products',
    title: 'Pork',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.',
    href: '/products/pork',
  },
  {
    image:
      'https://images.unsplash.com/photo-1559703248-dcaaec9fab78?w=384&h=256&fit=crop',
    imageAlt: 'Chicken and turkey',
    title: 'Chicken & Turkey',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.',
    href: '/products/poultry',
  },
  {
    image:
      'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=384&h=256&fit=crop',
    imageAlt: 'Fresh eggs',
    title: 'Eggs',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.',
    href: '/products/eggs',
  },
];

export const Default = {
  args: {
    eyebrow: 'Products',
    heading: 'What are you looking for?',
    subCopy:
      'Local, pasture-raised, higher welfare meat that tastes better too',
    products: mockProducts,
  },
};
