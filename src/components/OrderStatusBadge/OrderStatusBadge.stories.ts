// @storybook-astro/framework does not export Meta/StoryObj — Astro stories are untyped by design.
import OrderStatusBadge from '@/components/OrderStatusBadge/OrderStatusBadge.astro';

const meta = {
  title: 'Account/Orders/OrderStatusBadge',
  component: OrderStatusBadge,
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

export const Placed = { args: { status: 'placed' } };
export const Approved = { args: { status: 'approved' } };
export const Fulfilled = { args: { status: 'fulfilled' } };
export const Cancelled = { args: { status: 'cancelled' } };
