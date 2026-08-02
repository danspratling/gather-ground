// @storybook-astro/framework does not export Meta/StoryObj — Astro stories are untyped by design.

import Header from '@/components/Layout/Header/Header.astro';

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
  ctaLabel: 'Sign up',
  ctaHref: '/signup',
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

const meta = {
  title: 'Layout/Header/Desktop',
  component: Header,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    a11y: { disable: false },
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/zsTOcot4CKA5nq2ihg0ZLi/Gather-Ground-Website?node-id=683-17952',
    },
  },
};

export default meta;

export const Default = {
  args: {
    ...base,
    navLinks: withDropdowns,
  },
};

export const NoDropdowns = {
  args: {
    ...base,
    navLinks: withoutDropdowns,
  },
};

export const NoNavigation = {
  args: {
    ...base,
    navLinks: [],
  },
};

export const NoCta = {
  args: {
    ...base,
    navLinks: withDropdowns,
    ctaLabel: undefined,
    ctaHref: undefined,
  },
};

export const WithCommerceSlots = {
  args: {
    ...base,
    navLinks: withDropdowns,
    showCommerceSlots: true,
    ctaLabel: undefined,
    ctaHref: undefined,
  },
};
