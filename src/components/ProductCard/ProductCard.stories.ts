// @storybook-astro/framework does not export Meta/StoryObj — Astro stories are untyped by design.
// See: https://storybook-astro.org/writing-stories/
import { expect, within } from 'storybook/test';

import ProductCard from '@/components/ProductCard/ProductCard.astro';

const meta = {
  title: 'Core/Product Card',
  component: ProductCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    a11y: { disable: false },
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/zsTOcot4CKA5nq2ihg0ZLi/Gather-Ground-Website?node-id=18580-6378',
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['category', 'image-link', 'commerce'],
    },
  },
};

export default meta;

export const CategoryVariant = {
  args: {
    variant: 'category' as const,
    image:
      'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&q=80',
    imageAlt: 'Heritage beef cuts on a wooden board',
    title: 'Beef',
    description:
      'Angus and Hereford cattle raised on pasture. Dry-aged for flavour.',
    href: '/products/beef',
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement);
    await expect(await canvas.findByText('Beef')).toBeInTheDocument();
    await expect(
      await canvas.findByText(
        'Angus and Hereford cattle raised on pasture. Dry-aged for flavour.'
      )
    ).toBeInTheDocument();
    await expect(
      await canvas.findByRole('link', { name: /Beef/i })
    ).toBeInTheDocument();
  },
};

export const ImageLinkVariant = {
  args: {
    variant: 'image-link' as const,
    image:
      'https://images.unsplash.com/photo-1558030006-450675393462?w=600&q=80',
    imageAlt: 'Heritage pork from Gather Ground',
    title: 'Pork',
    href: '/products/pork',
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('Pork')).toBeInTheDocument();
    await expect(
      canvas.getByRole('link', { name: /pork/i })
    ).toBeInTheDocument();
  },
};

export const CategoryNoDescription = {
  args: {
    variant: 'category' as const,
    image: 'https://picsum.photos/seed/eggs/600/400',
    imageAlt: 'Free-range eggs',
    title: 'Eggs',
    href: '/products/eggs',
  },
};

export const CommerceVariant = {
  args: {
    variant: 'commerce' as const,
    image:
      'https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=600&q=80',
    imageAlt: 'Grass-fed lamb shoulder',
    title: 'Lamb Shoulder',
    href: '/products/lamb-shoulder',
    price: '£14.99',
    compareAtPrice: '£19.99',
    inventoryStatus: 'in_stock' as const,
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/zsTOcot4CKA5nq2ihg0ZLi/Gather-Ground-Website?node-id=18580-6378',
    },
    chromatic: { viewports: [375, 1440] },
  },
};

export const CommerceVariantLowStock = {
  args: {
    variant: 'commerce' as const,
    image:
      'https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=600&q=80',
    imageAlt: 'Grass-fed lamb shoulder',
    title: 'Lamb Shoulder',
    href: '/products/lamb-shoulder',
    price: '£14.99',
    compareAtPrice: '£19.99',
    inventoryStatus: 'low_stock' as const,
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/zsTOcot4CKA5nq2ihg0ZLi/Gather-Ground-Website?node-id=18580-6378',
    },
    chromatic: { viewports: [375, 1440] },
  },
};

export const CommerceVariantOOS = {
  args: {
    variant: 'commerce' as const,
    image:
      'https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=600&q=80',
    imageAlt: 'Grass-fed lamb shoulder',
    title: 'Lamb Shoulder',
    href: '/products/lamb-shoulder',
    price: '£14.99',
    inventoryStatus: 'out_of_stock' as const,
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/zsTOcot4CKA5nq2ihg0ZLi/Gather-Ground-Website?node-id=18580-6378',
    },
    chromatic: { viewports: [375, 1440] },
  },
};
