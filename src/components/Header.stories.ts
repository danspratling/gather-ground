// @storybook-astro/framework does not export Meta/StoryObj — Astro stories are untyped by design.
import { expect, userEvent, within } from 'storybook/test';

// @ts-expect-error — .astro files have no TypeScript declarations
import Header from '@/components/Header.astro';

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
  ctaLabel: 'Order now',
  ctaHref: '/shop',
};

const meta = {
  title: 'Layout/Header',
  component: Header,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    a11y: { disable: false },
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/zsTOcot4CKA5nq2ihg0ZLi/Gather-Ground-Website?node-id=1647-376189',
    },
  },
};

export default meta;

export const Desktop = {
  args: defaultArgs,
  parameters: {
    viewport: { defaultViewport: 'desktop' },
  },
};

export const Mobile = {
  args: defaultArgs,
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement);

    // Mobile menu should be closed on load
    await expect(
      canvas.queryByRole('navigation', { name: 'Mobile navigation' })
    ).toBeNull();

    // Open the menu
    const trigger = canvas.getByRole('button', { name: /open menu/i });
    await userEvent.click(trigger);

    // Navigation should now be visible
    const nav = canvas.getByRole('navigation', { name: 'Mobile navigation' });
    await expect(nav).toBeInTheDocument();
    await expect(canvas.getByText('Blog')).toBeInTheDocument();

    // Close the menu
    const closeBtn = canvas.getByRole('button', { name: /close menu/i });
    await userEvent.click(closeBtn);
    await expect(
      canvas.queryByRole('navigation', { name: 'Mobile navigation' })
    ).toBeNull();
  },
};

export const NoMenuItems = {
  args: {
    ...defaultArgs,
    navLinks: [
      { label: 'Shop', href: '/shop' },
      { label: 'About', href: '/about' },
      { label: 'Blog', href: '/blog' },
      { label: 'Contact', href: '/contact' },
    ],
  },
};
