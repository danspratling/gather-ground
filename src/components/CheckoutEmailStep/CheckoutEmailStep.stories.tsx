import type { Meta, StoryObj } from '@storybook/react';
import { userEvent, within } from 'storybook/test';
import type { Customer } from '@/lib/commerce/types';
import { CheckoutEmailStep } from './CheckoutEmailStep';

const mockCustomer: Customer = {
  id: 'cust-1',
  email: 'jane@example.com',
  firstName: 'Jane',
  lastName: 'Smith',
  addresses: [],
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-06-01'),
};

const meta = {
  title: 'Checkout/CheckoutEmailStep',
  component: CheckoutEmailStep,
  tags: ['autodocs'],
  parameters: {
    renderer: 'react',
    layout: 'centered',
    chromatic: { viewports: [375, 1440] },
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/zsTOcot4CKA5nq2ihg0ZLi/Gather-Ground-Website?node-id=0-1',
    },
  },
  args: {
    customer: null,
    onComplete: () => {},
  },
} satisfies Meta<typeof CheckoutEmailStep>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Guest email entry form — empty state */
export const Default: Story = {
  args: {},
};

/** Guest form with an email address already typed in */
export const GuestPrefilled: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(
      canvas.getByLabelText(/email address/i),
      'jane@example.com'
    );
  },
};

/** Logged-in customer — shows read-only email and sign-out option */
export const LoggedIn: Story = {
  args: {
    customer: mockCustomer,
  },
};
