// @ts-expect-error — .astro files have no TypeScript declarations
import CtaCard from '@/components/CtaCard/CtaCard.astro';

const mockProps = {
  heading: 'Start your 30-day free trial',
  body: 'Join over 4,000+ startups already growing with Untitled.',
  primaryCta: { label: 'Get started', href: '#' },
  secondaryCta: { label: 'Learn more', href: '#' },
};

const meta = {
  title: 'Sections/CtaCard',
  component: CtaCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    a11y: { disable: false },
    chromatic: { viewports: [375, 1440] },
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/zsTOcot4CKA5nq2ihg0ZLi/Gather-Ground-Website?node-id=1624-435597',
    },
  },
};

export default meta;

export const Horizontal = {
  args: {
    ...mockProps,
    layout: 'horizontal' as const,
  },
};

export const Vertical = {
  args: {
    ...mockProps,
    layout: 'vertical' as const,
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/zsTOcot4CKA5nq2ihg0ZLi/Gather-Ground-Website?node-id=1624-435579',
    },
  },
};

export const HorizontalMobile = {
  args: {
    ...mockProps,
    layout: 'horizontal' as const,
  },
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
    chromatic: { viewports: [375] },
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/zsTOcot4CKA5nq2ihg0ZLi/Gather-Ground-Website?node-id=1624-435570',
    },
  },
};

export const VerticalMobile = {
  args: {
    ...mockProps,
    layout: 'vertical' as const,
  },
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
    chromatic: { viewports: [375] },
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/zsTOcot4CKA5nq2ihg0ZLi/Gather-Ground-Website?node-id=1624-435588',
    },
  },
};
