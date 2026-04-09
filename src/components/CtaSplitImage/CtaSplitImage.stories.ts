// @ts-expect-error — .astro files have no TypeScript declarations
import CtaSplitImage from '@/components/CtaSplitImage/CtaSplitImage.astro';

const mockProps = {
  heading: 'Join 4,000+ startups growing with Untitled',
  body: 'Start your 30-day free trial today.',
  primaryCta: { label: 'Get started', href: '#' },
  secondaryCta: { label: 'Learn more', href: '#' },
  image: {
    src: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=592&h=740&fit=crop',
    alt: 'Professional woman with arms crossed',
  },
};

const meta = {
  title: 'Sections/CtaSplitImage',
  component: CtaSplitImage,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    a11y: { disable: false },
    chromatic: { viewports: [375, 1440] },
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/zsTOcot4CKA5nq2ihg0ZLi/Gather-Ground-Website?node-id=1365-198707',
    },
  },
};

export default meta;

export const Default = {
  args: {
    ...mockProps,
  },
};

export const PrimaryOnly = {
  args: {
    heading: mockProps.heading,
    body: mockProps.body,
    primaryCta: mockProps.primaryCta,
    image: mockProps.image,
  },
};
