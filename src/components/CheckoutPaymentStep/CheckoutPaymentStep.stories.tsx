import type { Meta, StoryObj } from '@storybook/react';
import { userEvent, within } from 'storybook/test';
import { CheckoutPaymentStep } from './CheckoutPaymentStep';

const shippingAddress = {
  firstName: 'Jane',
  lastName: 'Smith',
  line1: '123 Main St',
  city: 'London',
  postalCode: 'SW1A 1AA',
  country: 'GB',
};

const meta = {
  title: 'Components/CheckoutPaymentStep',
  component: CheckoutPaymentStep,
  parameters: {
    renderer: 'react',
    chromatic: { viewports: [375, 1440] },
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/PLACEHOLDER/Gather-Ground?node-id=checkout-payment-step',
    },
  },
  args: {
    shippingAddress,
    onComplete: (id: string) => console.log('Payment complete:', id),
    _clientSecret: '__mock_secret_test',
  },
} satisfies Meta<typeof CheckoutPaymentStep>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const BillingDifferent: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const checkbox = canvas.getByRole('checkbox', {
      name: /billing same as shipping/i,
    });
    await userEvent.click(checkbox);
  },
};

/**
 * Simulates the loading state — no _clientSecret so the component calls the
 * API on mount. In Storybook there is no live API so this will remain loading.
 */
export const Loading: Story = {
  args: {
    _clientSecret: undefined,
  },
};

/**
 * Demonstrates the error state. Without _clientSecret and without a live API
 * endpoint, the fetch will fail and the error message will be shown.
 */
export const Error: Story = {
  args: {
    _clientSecret: undefined,
  },
};
