import type { Meta, StoryObj } from '@storybook/react';
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
};

export const WithItems: Story = {
  args: {
    itemCount: 3,
  },
};

export const ManyItems: Story = {
  args: {
    itemCount: 99,
  },
};
