import type { Meta, StoryObj } from '@storybook/react';

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
  },
};

export const OutOfStock: Story = {
  args: {
    variantId: 'var-1',
    inventoryStatus: 'out_of_stock',
  },
};

export const LowStock: Story = {
  args: {
    variantId: 'var-1',
    inventoryStatus: 'low_stock',
  },
};
