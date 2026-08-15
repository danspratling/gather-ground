import type { Meta, StoryObj } from '@storybook/react';
import { StripePaymentElement } from './StripePaymentElement';

const meta: Meta<typeof StripePaymentElement> = {
  title: 'Components/StripePaymentElement',
  component: StripePaymentElement,
  parameters: {
    renderer: 'react',
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/placeholder', // Replace with actual Figma frame URL
    },
    chromatic: { disableSnapshot: true }, // Stripe Elements requires network — disable Chromatic snapshot
  },
};

export default meta;
type Story = StoryObj<typeof StripePaymentElement>;

export const Default: Story = {
  args: {
    clientSecret: 'pi_test_mock_secret_seti_1_secret_mock',
    onSuccess: (id: string) => console.log('Payment succeeded:', id),
    onError: (msg: string) => console.error('Payment error:', msg),
  },
};
