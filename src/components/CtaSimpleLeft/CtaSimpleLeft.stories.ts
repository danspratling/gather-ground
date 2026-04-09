// @ts-expect-error — .astro files have no TypeScript declarations
import CtaSimpleLeft from '@/components/CtaSimpleLeft/CtaSimpleLeft.astro';

const mockProps = {
  heading: 'Start your free trial',
  body: 'Join over 4,000+ startups already growing with Untitled.',
  primaryCta: { label: 'Get started', href: '#' },
  secondaryCta: { label: 'Learn more', href: '#' },
};

const meta = {
  title: 'Sections/CtaSimpleLeft',
  component: CtaSimpleLeft,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    a11y: { disable: false },
    chromatic: { viewports: [375, 1440] },
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/zsTOcot4CKA5nq2ihg0ZLi/Gather-Ground-Website?node-id=1365-198680',
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
  },
};

export const Mobile = {
  args: {
    ...mockProps,
  },
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
    chromatic: { viewports: [375] },
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/zsTOcot4CKA5nq2ihg0ZLi/Gather-Ground-Website?node-id=1365-198681',
    },
  },
};
