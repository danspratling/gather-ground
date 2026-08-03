import type { Meta, StoryObj } from '@storybook/react';
import CartDrawer from '@/components/CartDrawer/CartDrawer';
import type { LineItem } from '@/lib/commerce/types';

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

const meta = {
  title: 'Commerce/CartDrawer',
  component: CartDrawer,
  tags: ['autodocs'],
  parameters: {
    renderer: 'react',
    layout: 'fullscreen',
    a11y: { disable: false },
    chromatic: { viewports: [375, 1440] },
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/zsTOcot4CKA5nq2ihg0ZLi/Gather-Ground-Website?node-id=0-1',
    },
  },
} satisfies Meta<typeof CartDrawer>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Drawer open showing empty cart state */
export const Empty: Story = {
  args: { _isOpen: true },
};

/**
 * Drawer open with two items in cart.
 * Uses `_items` prop override to supply mock data without a live cart store.
 */
export const WithItems: Story = {
  args: {
    _isOpen: true,
    _items: mockItems,
  },
  play: async () => {
    window.dispatchEvent(new CustomEvent('cart:open'));
    await new Promise((r) => setTimeout(r, 300));
  },
};

/** Drawer open with a loading overlay — e.g. quantity update in progress */
export const Loading: Story = {
  args: {
    _isOpen: true,
    _items: mockItems,
    _isLoading: true,
  },
};
