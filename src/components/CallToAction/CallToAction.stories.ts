// @ts-expect-error — .astro files have no TypeScript declarations
import CallToActionSimpleCentered from '@/components/CallToAction/CallToActionSimpleCentered.astro';

const simpleCenteredProps = {
  heading: 'Start your free trial',
  body: 'Join over 4,000+ startups already growing with Untitled.',
  primaryCta: { label: 'Get started', href: '#' },
  secondaryCta: { label: 'Learn more', href: '#' },
};

const meta = {
  title: 'Sections/Call To Action',
  component: CallToActionSimpleCentered,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    a11y: { disable: false },
    chromatic: { viewports: [375, 1440] },
  },
};

export default meta;

export const SimpleCentered = {
  component: CallToActionSimpleCentered,
  args: {
    ...simpleCenteredProps,
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/zsTOcot4CKA5nq2ihg0ZLi/Gather-Ground-Website?node-id=1365-198678',
    },
  },
};

export const SimpleCenteredPrimaryOnly = {
  component: CallToActionSimpleCentered,
  args: {
    heading: simpleCenteredProps.heading,
    body: simpleCenteredProps.body,
    primaryCta: simpleCenteredProps.primaryCta,
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/zsTOcot4CKA5nq2ihg0ZLi/Gather-Ground-Website?node-id=1365-198678',
    },
  },
};
