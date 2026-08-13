import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, within } from 'storybook/test';
import CartTrigger from '@/components/CartTrigger/CartTrigger';

const meta = {
  title: 'Commerce/CartTrigger',
  component: CartTrigger,
  tags: ['autodocs'],
  parameters: {
    renderer: 'react',
    layout: 'centered',
    a11y: { disable: false },
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/zsTOcot4CKA5nq2ihg0ZLi/Gather-Ground-Website?node-id=0-1',
    },
  },
} satisfies Meta<typeof CartTrigger>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  args: {
    itemCount: 0,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const openEvents: Event[] = [];
    const handler = (e: Event) => openEvents.push(e);
    window.addEventListener('cart:open', handler);

    const button = canvas.getByRole('button', { name: /open cart/i });
    await expect(button).toBeInTheDocument();
    await userEvent.click(button);
    await expect(openEvents).toHaveLength(1);

    window.removeEventListener('cart:open', handler);
  },
};

export const WithItems: Story = {
  args: {
    itemCount: 3,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button', {
      name: /open cart, 3 items/i,
    });
    await expect(button).toBeInTheDocument();
  },
};

export const LiveUpdate: Story = {
  args: {
    itemCount: 0,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Wait for the component to mount and register its cart:updated listener
    // before dispatching — useEffect runs after paint in real-browser mode.
    await canvas.findByRole('button', { name: /open cart/i });

    // Initially no badge
    await expect(canvas.queryByText('5')).not.toBeInTheDocument();

    // Simulate cart:updated event
    window.dispatchEvent(
      new CustomEvent('cart:updated', { detail: { itemCount: 5 } })
    );

    // Badge should now show the updated count
    await expect(await canvas.findByText('5')).toBeVisible();
  },
};

export const ManyItems: Story = {
  args: {
    itemCount: 99,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const badge = canvas.getByText('99');
    await expect(badge).toBeVisible();
  },
};
