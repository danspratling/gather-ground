import type { Meta, StoryObj } from '@storybook/react';
import { userEvent, within } from 'storybook/test';

import AccountCartPanel from './AccountCartPanel';

const mockCustomer = {
  id: 'cust_001',
  email: 'jane.doe@example.com',
  firstName: 'Jane',
  lastName: 'Doe',
  phone: '+44 7700 900123',
  addresses: [],
  createdAt: new Date('2024-01-15'),
  updatedAt: new Date('2024-06-01'),
};

const meta = {
  title: 'Commerce/AccountCartPanel',
  component: AccountCartPanel,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    renderer: 'react',
    chromatic: { viewports: [375, 1440] },
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/zsTOcot4CKA5nq2ihg0ZLi/Gather-Ground-Website?node-id=0-1',
    },
  },
} satisfies Meta<typeof AccountCartPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LoggedInEmpty: Story = {
  args: {
    customer: mockCustomer,
  },
};

export const LoggedInWithBadge: Story = {
  args: {
    customer: mockCustomer,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Dispatch a cart:updated event with count=3 to show the badge
    const trigger = canvas.getByRole('button', {
      name: /account menu/i,
    });
    trigger.dispatchEvent(
      new CustomEvent('cart:updated', {
        detail: { count: 3 },
        bubbles: true,
      })
    );
  },
};

export const PopoverOpen: Story = {
  args: {
    customer: mockCustomer,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button', {
      name: /account menu/i,
    });
    await userEvent.click(trigger);
  },
};
