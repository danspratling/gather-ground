import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, within } from 'storybook/test';
import CartItemRow from '@/components/CartItemRow/CartItemRow';
import type { LineItem } from '@/lib/commerce/types';

const mockLineItem: LineItem = {
  id: 'line-item-1',
  variantId: 'Organic Loose Leaf Tea — Earl Grey',
  quantity: 2,
  price: {
    amount: 1499,
    currency: 'GBP',
    formatted: '£14.99',
  },
  subtotal: {
    amount: 2998,
    currency: 'GBP',
    formatted: '£29.98',
  },
  selectedOptions: {
    Size: '100g',
    Blend: 'Earl Grey',
  },
};

const meta = {
  title: 'Commerce/CartItemRow',
  component: CartItemRow,
  tags: ['autodocs'],
  parameters: {
    renderer: 'react',
    layout: 'padded',
    a11y: { disable: false },
    chromatic: { viewports: [375, 1440] },
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/zsTOcot4CKA5nq2ihg0ZLi/Gather-Ground-Website?node-id=0-1',
    },
  },
} satisfies Meta<typeof CartItemRow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    item: mockLineItem,
    onQuantityChange: fn(),
    onRemove: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const increment = canvas.getByRole('button', {
      name: /increase quantity/i,
    });
    const remove = canvas.getByRole('button', { name: /remove item/i });

    // Increment quantity — fires onQuantityChange with item id and new qty
    await userEvent.click(increment);
    await expect(args.onQuantityChange).toHaveBeenCalledWith('line-item-1', 3);

    // Click remove — fires onRemove with item id
    await userEvent.click(remove);
    await expect(args.onRemove).toHaveBeenCalledWith('line-item-1');
  },
};

export const Updating: Story = {
  args: {
    item: mockLineItem,
    onQuantityChange: fn(),
    onRemove: fn(),
    isUpdating: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const increment = canvas.getByRole('button', {
      name: /increase quantity/i,
    });
    const remove = canvas.getByRole('button', { name: /remove item/i });

    // All controls must be disabled while updating
    await expect(increment).toBeDisabled();
    await expect(remove).toBeDisabled();
  },
};

export const LongName: Story = {
  args: {
    item: {
      ...mockLineItem,
      variantId:
        'Premium Single-Origin Ethiopian Yirgacheffe Whole Loose Leaf Green Tea Blend with Jasmine Flowers',
      selectedOptions: {
        Size: '250g',
        Grind: 'Whole Leaf',
        Roast: 'Light',
      },
    },
    onQuantityChange: fn(),
    onRemove: fn(),
  },
};
