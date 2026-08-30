import type { Meta, StoryObj } from '@storybook/react';
import type { LineItem } from '@/lib/commerce/types';
import type { CartState } from '@/lib/commerce/cart/store';
import { CheckoutSummary } from '@/components/CheckoutSummary/CheckoutSummary';

const mockItems: LineItem[] = [
  {
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
  },
  {
    id: 'line-item-2',
    variantId: 'Wildflower Honey',
    quantity: 1,
    price: {
      amount: 899,
      currency: 'GBP',
      formatted: '£8.99',
    },
    subtotal: {
      amount: 899,
      currency: 'GBP',
      formatted: '£8.99',
    },
    selectedOptions: {
      Size: '340g',
    },
  },
];

const baseCart: CartState = {
  id: 'cart-mock-001',
  items: mockItems,
  subtotal: '£38.97',
  total: '£38.97',
  count: 3,
  isLoading: false,
};

const meta = {
  title: 'Commerce/CheckoutSummary',
  component: CheckoutSummary,
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
} satisfies Meta<typeof CheckoutSummary>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Order summary with two line items */
export const Default: Story = {
  args: {
    cart: baseCart,
  },
};

/** Order summary with an empty cart */
export const Empty: Story = {
  args: {
    cart: {
      ...baseCart,
      id: null,
      items: [],
      subtotal: '£0.00',
      total: '£0.00',
      count: 0,
    },
  },
};
