// @storybook-astro/framework does not export Meta/StoryObj — Astro stories are untyped by design.
// See: https://storybook-astro.org/writing-stories/

import ProductsSection from '@/components/ProductsSection/ProductsSection.astro';

const meta = {
  title: 'Sections/Products Section',
  component: ProductsSection,
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

const mockCategoryProducts = [
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

const mockImageProducts = [
  {
    image:
      'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=576&h=512&fit=crop',
    imageAlt: 'Beef topside roasting joint',
    title: 'Beef topside roasting joint',
    href: '/products/beef-topside',
  },
  {
    image:
      'https://images.unsplash.com/photo-1588347818036-4b8c0a6f7a22?w=576&h=512&fit=crop',
    imageAlt: 'Beef mince',
    title: 'Beef Mince 15% lean',
    href: '/products/beef-mince',
  },
  {
    image:
      'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=576&h=512&fit=crop',
    imageAlt: 'Pork belly',
    title: 'Pork belly',
    href: '/products/pork-belly',
  },
  {
    image:
      'https://images.unsplash.com/photo-1448453297814-e8f69038e4b9?w=576&h=512&fit=crop',
    imageAlt: 'Whole chicken',
    title: 'Whole Chicken',
    href: '/products/whole-chicken',
  },
  {
    image:
      'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=576&h=512&fit=crop',
    imageAlt: 'Free range eggs',
    title: 'Free Range Eggs',
    href: '/products/eggs',
  },
];

export const Cards = {
  args: {
    variant: 'cards',
    eyebrow: 'Products',
    heading: 'What are you looking for?',
    subCopy:
      'Local, pasture-raised, higher welfare meat that tastes better too',
    products: mockCategoryProducts,
  },
};

export const CarouselVariant = {
  name: 'Carousel',
  args: {
    variant: 'carousel',
    eyebrow: 'Products',
    heading: 'What are you looking for?',
    subCopy:
      'Local, pasture-raised, higher welfare meat that tastes better too',
    products: mockImageProducts,
  },
};
