// @storybook-astro/framework does not export Meta/StoryObj — Astro stories are untyped by design.
// See: https://storybook-astro.org/writing-stories/
import CheckoutStepper from '@/components/CheckoutStepper/CheckoutStepper.astro';

const meta = {
  title: 'Components/Checkout Stepper',
  component: CheckoutStepper,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    a11y: { disable: false },
    chromatic: { viewports: [375, 1440] },
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/placeholder',
    },
  },
};

export default meta;

export const EmailActive = {
  args: {
    activeStep: 'email',
    stepStatuses: {
      email: 'active',
      shipping: 'pending',
      payment: 'pending',
    },
  },
};

export const ShippingActive = {
  args: {
    activeStep: 'shipping',
    stepStatuses: {
      email: 'complete',
      shipping: 'active',
      payment: 'pending',
    },
  },
};

export const PaymentActive = {
  args: {
    activeStep: 'payment',
    stepStatuses: {
      email: 'complete',
      shipping: 'complete',
      payment: 'active',
    },
  },
};

export const AllComplete = {
  args: {
    activeStep: 'payment',
    stepStatuses: {
      email: 'complete',
      shipping: 'complete',
      payment: 'complete',
    },
  },
};
