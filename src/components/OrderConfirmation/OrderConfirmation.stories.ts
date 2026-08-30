// @storybook-astro/framework does not export Meta/StoryObj — Astro stories are untyped by design.
// See: https://storybook-astro.org/writing-stories/
import OrderConfirmation from '@/components/OrderConfirmation/OrderConfirmation.astro';

const meta = {
  title: 'Checkout/OrderConfirmation',
  component: OrderConfirmation,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    a11y: { disable: false },
    chromatic: { viewports: [375, 1440] },
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/zsTOcot4CKA5nq2ihg0ZLi/Gather-Ground-Website?node-id=0-1',
    },
  },
};

export default meta;

export const Guest = {
  args: {
    orderId: 'ord-abc123',
    orderNumber: '12345',
    customerEmail: 'jane@example.com',
    isAuthenticated: false,
  },
};

export const Authenticated = {
  args: {
    orderId: 'ord-abc123',
    orderNumber: '12345',
    customerEmail: 'jane@example.com',
    isAuthenticated: true,
  },
};

export const NoEmail = {
  args: {
    orderId: 'ord-abc123',
    isAuthenticated: false,
  },
};
