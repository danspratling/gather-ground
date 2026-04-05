import type { Meta, StoryObj } from '@storybook/react';
import { expect, screen, userEvent, waitFor, within } from 'storybook/test';

import NavMenu from '@/components/Layout/Header/NavMenu';

const meta = {
  title: 'Core/Nav Menu',
  component: NavMenu,
  tags: ['autodocs'],
  parameters: {
    renderer: 'react',
    layout: 'centered',
    a11y: { disable: false },
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/zsTOcot4CKA5nq2ihg0ZLi/Gather-Ground-Website?node-id=1647-376189',
    },
  },
} satisfies Meta<typeof NavMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

const shopItems = [
  {
    label: 'Beef',
    href: '/shop/beef',
    description: 'Heritage Angus and Hereford, dry-aged for flavour.',
  },
  {
    label: 'Pork',
    href: '/shop/pork',
    description: 'Berkshire and Duroc, pasture-raised year-round.',
  },
  {
    label: 'Chicken',
    href: '/shop/chicken',
    description: 'Freedom Ranger, slow-grown on open pasture.',
  },
  {
    label: 'View all products',
    href: '/shop',
    iconTrailing: true,
  },
];

const aboutItems = [
  {
    label: 'Our story',
    href: '/about',
    description: 'How Gather Ground began.',
  },
  {
    label: 'The farm',
    href: '/about/farm',
    description: 'Our land and animals.',
  },
  { label: 'Sustainability', href: '/about/sustainability' },
];

export const Default: Story = {
  args: {
    label: 'Shop',
    items: shopItems,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Dropdown links should not be visible on load (portaled to document.body)
    expect(screen.queryByRole('link', { name: /beef/i })).toBeNull();

    // Click trigger to open
    const trigger = canvas.getByRole('button', { name: /shop/i });
    await userEvent.click(trigger);

    // Panel and first item should be visible
    const beefLink = await screen.findByRole('link', { name: /beef/i });
    await expect(beefLink).toBeInTheDocument();

    // Press Escape to close
    await userEvent.keyboard('{Escape}');
    await waitFor(() =>
      expect(screen.queryByRole('link', { name: /beef/i })).toBeNull()
    );
  },
};

export const WithShortItems: Story = {
  args: {
    label: 'About us',
    items: aboutItems,
  },
};

export const NoDescriptions: Story = {
  args: {
    label: 'Navigate',
    items: [
      { label: 'Home', href: '/' },
      { label: 'Shop', href: '/shop' },
      { label: 'Blog', href: '/blog' },
      { label: 'Contact', href: '/contact' },
    ],
  },
};
