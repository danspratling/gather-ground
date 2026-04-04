// @storybook-astro/framework does not export Meta/StoryObj — Astro stories are untyped by design.
// See: https://storybook-astro.org/writing-stories/
import { expect, within } from 'storybook/test';

// @ts-expect-error — .astro files have no TypeScript declarations
import Footer from '@/components/Footer.astro';

const meta = {
  title: 'Components/Footer',
  component: Footer,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/zsTOcot4CKA5nq2ihg0ZLi/Gather-Ground-Website?node-id=1647-376190',
    },
  },
};

export default meta;

const defaultArgs = {
  logoSrc: '/favicon.svg',
  logoAlt: 'Gather Ground',
  description:
    'Family farm in rural Iowa. We raise heritage breed animals on pasture year-round.',
  socialLinks: [
    { platform: 'instagram' as const, href: '#', label: 'Instagram' },
    { platform: 'facebook' as const, href: '#', label: 'Facebook' },
    { platform: 'tiktok' as const, href: '#', label: 'TikTok' },
  ],
  linkGroups: [
    {
      heading: 'Company',
      links: [
        { label: 'About', href: '#' },
        { label: 'News', href: '#' },
        { label: 'Shop', href: '#', badge: 'New' },
        { label: 'Contact', href: '#' },
      ],
    },
    {
      heading: 'Products',
      links: [
        { label: 'Beef', href: '#' },
        { label: 'Pork', href: '#' },
        { label: 'Chicken', href: '#' },
        { label: 'Turkey', href: '#' },
        { label: 'Eggs', href: '#' },
      ],
    },
  ],
  newsletterHeading: 'Stay up to date',
  copyrightText: '© 2026 Gather Ground',
  legalLinks: [
    { label: 'Terms', href: '#' },
    { label: 'Privacy', href: '#' },
    { label: 'Cookies', href: '#' },
  ],
};

export const Default = {
  args: defaultArgs,
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText('© 2026 Gather Ground')).toBeInTheDocument();
    await expect(canvas.getByText('Company')).toBeInTheDocument();
    await expect(canvas.getByText('Products')).toBeInTheDocument();
    await expect(canvas.getByText('Stay up to date')).toBeInTheDocument();
    await expect(canvas.getByText('New')).toBeInTheDocument();
    await expect(
      canvas.getByRole('link', { name: 'Instagram' })
    ).toBeInTheDocument();
  },
};

export const MinimalLinks = {
  args: {
    ...defaultArgs,
    linkGroups: [
      {
        heading: 'Company',
        links: [
          { label: 'About', href: '#' },
          { label: 'Contact', href: '#' },
        ],
      },
    ],
    legalLinks: [{ label: 'Privacy', href: '#' }],
  },
};
