import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from 'storybook/test';

import BlogFilters from '@/components/BlogFilters/BlogFilters';

const meta = {
  title: 'Blog/Blog Filters',
  component: BlogFilters,
  tags: ['autodocs'],
  parameters: {
    renderer: 'react',
    layout: 'padded',
    a11y: { disable: false },
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/zsTOcot4CKA5nq2ihg0ZLi/Gather-Ground-Website?node-id=1624-472083',
    },
  },
} satisfies Meta<typeof BlogFilters>;

export default meta;
type Story = StoryObj<typeof meta>;

const categories = [
  'Design',
  'Product',
  'Software Engineering',
  'Customer Success',
];

export const Default: Story = {
  args: {
    categories,
    initialCategory: null,
    initialSearch: '',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const designTab = canvas.getByRole('button', { name: /design/i });
    await userEvent.click(designTab);
    expect(designTab).toHaveAttribute('aria-pressed', 'true');

    const viewAllTab = canvas.getByRole('button', { name: /view all/i });
    expect(viewAllTab).toHaveAttribute('aria-pressed', 'false');
  },
};

export const WithActiveCategory: Story = {
  args: {
    categories,
    initialCategory: 'Design',
    initialSearch: '',
  },
};

export const WithSearch: Story = {
  args: {
    categories,
    initialCategory: null,
    initialSearch: 'heritage',
  },
};
