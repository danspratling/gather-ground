// @storybook-astro/framework does not export Meta/StoryObj — Astro stories are untyped by design.

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
};

export const MobileDefault = {
  name: 'Mobile (closed)',
  args: defaultArgs,
};

export const MobileOpen = {
  name: 'Mobile (menu open)',
  args: defaultArgs,
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
