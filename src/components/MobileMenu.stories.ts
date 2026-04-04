import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from 'storybook/test';

import MobileMenu from '@/components/MobileMenu';

const shopMenu = [
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
  { label: 'View all products', href: '/shop', iconTrailing: true },
];

const aboutMenu = [
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

const defaultArgs = {
  logoSrc: '/favicon.svg',
  logoAlt: 'Gather Ground',
  navLinks: [
    { label: 'Shop', menu: shopMenu },
    { label: 'About us', menu: aboutMenu },
    { label: 'Blog', href: '/blog' },
    { label: 'Contact', href: '/contact' },
  ],
  ctaLabel: 'Shop now',
  ctaHref: '/shop',
  loginLabel: 'Log in',
  loginHref: '/login',
  footerLinks: [
    { label: 'About us', href: '/about' },
    { label: 'Blog', href: '/blog' },
    { label: 'Privacy', href: '/privacy' },
    { label: 'Terms', href: '/terms' },
    { label: 'Contact', href: '/contact' },
    { label: 'Cookies', href: '/cookies' },
  ],
};

const meta = {
  title: 'Layout/Mobile Menu',
  component: MobileMenu,
  tags: ['autodocs'],
  parameters: {
    renderer: 'react',
    layout: 'fullscreen',
    viewport: { defaultViewport: 'mobile' },
    a11y: { disable: false },
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/zsTOcot4CKA5nq2ihg0ZLi/Gather-Ground-Website?node-id=683-17952',
    },
  },
} satisfies Meta<typeof MobileMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Closed: Story = {
  args: defaultArgs,
};

export const Open: Story = {
  args: defaultArgs,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Hamburger visible, panel hidden
    const openBtn = canvas.getByRole('button', { name: /open menu/i });
    await expect(openBtn).toBeInTheDocument();
    await expect(
      canvas.queryByRole('navigation', { name: 'Mobile navigation' })
    ).toBeNull();

    // Open the menu
    await userEvent.click(openBtn);

    // Panel visible with nav items
    const nav = canvas.getByRole('navigation', { name: 'Mobile navigation' });
    await expect(nav).toBeInTheDocument();
    await expect(canvas.getByText('Shop')).toBeInTheDocument();
    await expect(canvas.getByText('Blog')).toBeInTheDocument();
    await expect(canvas.getByText('Shop now')).toBeInTheDocument();
    await expect(canvas.getByText('Log in')).toBeInTheDocument();
  },
};

export const WithSubnavOpen: Story = {
  args: defaultArgs,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Open the mobile menu
    await userEvent.click(canvas.getByRole('button', { name: /open menu/i }));

    // Expand the Shop accordion
    const shopToggle = canvas.getByRole('button', { name: /^shop$/i });
    await userEvent.click(shopToggle);
    await expect(shopToggle).toHaveAttribute('aria-expanded', 'true');

    // Sub-items should be visible
    await expect(canvas.getByText('Beef')).toBeInTheDocument();
    await expect(canvas.getByText('Pork')).toBeInTheDocument();
    await expect(
      canvas.getByText('Heritage Angus and Hereford, dry-aged for flavour.')
    ).toBeInTheDocument();

    // Collapse it
    await userEvent.click(shopToggle);
    await expect(shopToggle).toHaveAttribute('aria-expanded', 'false');
    await expect(canvas.queryByText('Beef')).toBeNull();
  },
};

export const CloseButton: Story = {
  args: defaultArgs,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Open then close via the X inside the panel
    await userEvent.click(canvas.getByRole('button', { name: /open menu/i }));
    await expect(
      canvas.getByRole('navigation', { name: 'Mobile navigation' })
    ).toBeInTheDocument();

    await userEvent.click(canvas.getByRole('button', { name: /close menu/i }));
    await expect(
      canvas.queryByRole('navigation', { name: 'Mobile navigation' })
    ).toBeNull();
  },
};
