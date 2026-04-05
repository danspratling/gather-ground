// @storybook-astro/framework does not export Meta/StoryObj — Astro stories are untyped by design.
// See: https://storybook-astro.org/writing-stories/
import { expect, within } from 'storybook/test';

// @ts-expect-error — .astro files have no TypeScript declarations
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
      options: ['category', 'image-link'],
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
    await expect(canvas.getByText('Beef')).toBeInTheDocument();
    await expect(
      canvas.getByText(
        'Angus and Hereford cattle raised on pasture. Dry-aged for flavour.'
      )
    ).toBeInTheDocument();
    await expect(
      canvas.getByRole('link', { name: /Beef/i })
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
