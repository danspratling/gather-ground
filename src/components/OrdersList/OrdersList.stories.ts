// @storybook-astro/framework does not export Meta/StoryObj — Astro stories are untyped by design.
import OrdersList from '@/components/OrdersList/OrdersList.astro';

const meta = {
  title: 'Account/Orders/OrdersList',
  component: OrdersList,
  tags: ['autodocs'],
  parameters: {
    a11y: { disable: false },
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/zsTOcot4CKA5nq2ihg0ZLi/Gather-Ground-Website?node-id=0-1',
    },
  },
};

export default meta;

export const WithOrders = {
  args: {
    orders: [
      {
        id: 'ord-001',
        orderNumber: '#1234',
        placedAt: '2026-07-15T00:00:00.000Z',
        status: 'fulfilled',
        itemCount: 3,
        totalFormatted: '£48.00',
      },
      {
        id: 'ord-002',
        orderNumber: '#1235',
        placedAt: '2026-07-20T00:00:00.000Z',
        status: 'placed',
        itemCount: 1,
        totalFormatted: '£12.00',
      },
      {
        id: 'ord-003',
        orderNumber: '#1236',
        placedAt: '2026-06-01T00:00:00.000Z',
        status: 'cancelled',
        itemCount: 2,
        totalFormatted: '£30.00',
      },
    ],
  },
};

export const Empty = {
  args: {
    orders: [],
  },
};
