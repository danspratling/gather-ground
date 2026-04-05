import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from 'storybook/test';

import MobileMenu from '@/components/Layout/Header/MobileMenu';

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

const base = {
  logoSrc: '/favicon.svg',
  logoAlt: 'Gather Ground',
  accountHref: '/account',
  footerLinks: [
    { label: 'About us', href: '/about' },
    { label: 'Blog', href: '/blog' },
    { label: 'Privacy', href: '/privacy' },
    { label: 'Terms', href: '/terms' },
    { label: 'Contact', href: '/contact' },
    { label: 'Cookies', href: '/cookies' },
  ],
};

const withDropdowns = [
  { label: 'Shop', menu: shopMenu },
  { label: 'About us', menu: aboutMenu },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' },
];

const withoutDropdowns = [
  { label: 'Shop', href: '/shop' },
  { label: 'About us', href: '/about' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' },
];

/** Opens the menu via the hamburger button before each story renders. */
const openMenu = async ({ canvasElement }: { canvasElement: HTMLElement }) => {
  const canvas = within(canvasElement);
  await userEvent.click(canvas.getByRole('button', { name: /open menu/i }));
  await expect(
    canvas.getByRole('navigation', { name: 'Mobile navigation' })
  ).toBeInTheDocument();
};

const meta = {
  title: 'Layout/Header/Mobile',
  component: MobileMenu,
  tags: ['autodocs'],
  parameters: {
    renderer: 'react',
    layout: 'fullscreen',
    a11y: { disable: false },
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/zsTOcot4CKA5nq2ihg0ZLi/Gather-Ground-Website?node-id=683-17952',
    },
  },
} satisfies Meta<typeof MobileMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { ...base, navLinks: withDropdowns },
  play: openMenu,
};

export const NoDropdowns: Story = {
  args: { ...base, navLinks: withoutDropdowns },
  play: openMenu,
};

export const NoNavigation: Story = {
  args: { ...base, navLinks: [] },
  play: openMenu,
};

export const ActionButtons: Story = {
  args: { ...base, navLinks: withDropdowns },
  play: openMenu,
};
