import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, within } from 'storybook/test';

import AddToCartButton from '@/components/Forms/AddToCartButton/AddToCartButton';

const meta = {
  title: 'Commerce/Add to Cart Button',
  component: AddToCartButton,
  tags: ['autodocs'],
  parameters: {
    renderer: 'react',
    layout: 'padded',
    a11y: { disable: false },
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/zsTOcot4CKA5nq2ihg0ZLi/Gather-Ground-Website?node-id=0-1',
    },
    chromatic: { viewports: [375, 1440] },
  },
} satisfies Meta<typeof AddToCartButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    variantId: 'var-1',
    inventoryStatus: 'in_stock',
    onAddToCart: fn(),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText('Quantity');
    const increment = canvas.getByLabelText('Increase quantity');
    const decrement = canvas.getByLabelText('Decrease quantity');

    await expect(input).toHaveValue(1);
    await expect(decrement).toBeDisabled();

    // Step up twice — catches the state-fighting regression where second click was stuck
    await userEvent.click(increment);
    await expect(input).toHaveValue(2);

    await userEvent.click(increment);
    await expect(input).toHaveValue(3);

    // Step down confirms decrement also keeps working
    await userEvent.click(decrement);
    await expect(input).toHaveValue(2);

    // Add to cart button is enabled
    const addBtn = canvas.getByRole('button', { name: /add to cart/i });
    await expect(addBtn).not.toBeDisabled();
  },
};

export const OutOfStock: Story = {
  args: {
    variantId: 'var-1',
    inventoryStatus: 'out_of_stock',
    onAddToCart: fn(),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Stepper disabled in OOS state
    await expect(canvas.getByLabelText('Increase quantity')).toBeDisabled();
    await expect(canvas.getByLabelText('Decrease quantity')).toBeDisabled();

    // Add to cart button is disabled and shows correct label
    const addBtn = canvas.getByRole('button', { name: /out of stock/i });
    await expect(addBtn).toBeDisabled();
  },
};

export const LowStock: Story = {
  args: {
    variantId: 'var-1',
    inventoryStatus: 'low_stock',
    onAddToCart: fn(),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const addToCart = canvas.getByRole('button', { name: /add to cart/i });

    // Low stock is still purchasable
    await expect(addToCart).not.toBeDisabled();
  },
};
