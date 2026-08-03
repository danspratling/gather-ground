// @storybook-astro/framework does not export Meta/StoryObj — Astro stories are untyped by design.
import OrderListItem from '@/components/OrderListItem/OrderListItem.astro';

const meta = {
  title: 'Account/Orders/OrderListItem',
  component: OrderListItem,
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

export const Default = {
  args: {
    id: 'ord-001',
    orderNumber: '#1234',
    placedAt: '2026-07-15T00:00:00.000Z',
    status: 'fulfilled',
    itemCount: 3,
    totalFormatted: '£48.00',
  },
};

export const Cancelled = {
  args: {
    id: 'ord-002',
    orderNumber: '#1235',
    placedAt: '2026-07-20T00:00:00.000Z',
    status: 'cancelled',
    itemCount: 1,
    totalFormatted: '£12.00',
  },
};

export const LongOrderNumber = {
  args: {
    id: 'ord-003',
    orderNumber: '#GG-2026-00099999',
    placedAt: '2026-06-01T00:00:00.000Z',
    status: 'placed',
    itemCount: 10,
    totalFormatted: '£249.99',
  },
};
