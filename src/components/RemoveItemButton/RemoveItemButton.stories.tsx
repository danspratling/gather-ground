import type { Meta, StoryObj } from '@storybook/react';
import { fn } from 'storybook/test';
import RemoveItemButton from '@/components/RemoveItemButton/RemoveItemButton';

const meta = {
  title: 'Commerce/RemoveItemButton',
  component: RemoveItemButton,
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
} satisfies Meta<typeof RemoveItemButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onRemove: fn(),
  },
};

export const Loading: Story = {
  args: {
    onRemove: fn(),
    isLoading: true,
  },
};
