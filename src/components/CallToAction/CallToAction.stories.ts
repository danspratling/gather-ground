import CallToAction from '@/components/CallToAction/CallToAction.astro';

const simpleCenteredProps = {
  variant: 'simple-centered' as const,
  heading: 'Start your free trial',
  body: 'Join over 4,000+ startups already growing with Untitled.',
  primaryCta: { label: 'Get started', href: '#' },
  secondaryCta: { label: 'Learn more', href: '#' },
};

const simpleLeftProps = {
  variant: 'simple-left' as const,
  heading: 'Start your free trial',
  body: 'Join over 4,000+ startups already growing with Untitled.',
  primaryCta: { label: 'Get started', href: '#' },
  secondaryCta: { label: 'Learn more', href: '#' },
};

const cardCenteredProps = {
  variant: 'card-centered' as const,
  heading: 'Start your 30-day free trial',
  body: 'Join over 4,000+ startups already growing with Untitled.',
  primaryCta: { label: 'Get started', href: '#' },
  secondaryCta: { label: 'Learn more', href: '#' },
};

const cardLeftProps = {
  variant: 'card-left' as const,
  heading: 'Start your 30-day free trial',
  body: 'Join over 4,000+ startups already growing with Untitled.',
  primaryCta: { label: 'Get started', href: '#' },
  secondaryCta: { label: 'Learn more', href: '#' },
};

const splitImageProps = {
  variant: 'split-image' as const,
  heading: 'Join 4,000+ startups growing with Untitled',
  body: 'Start your 30-day free trial today.',
  primaryCta: { label: 'Get started', href: '#' },
  secondaryCta: { label: 'Learn more', href: '#' },
  image: {
    src: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=592&h=592&fit=crop',
    alt: 'Woman with curly hair standing with arms crossed',
  },
};

const meta = {
  title: 'Sections/Call To Action',
  component: CallToAction,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    a11y: { disable: false },
    chromatic: { viewports: [375, 1440] },
  },
};

export default meta;

export const SimpleCentered = {
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
  args: {
    variant: 'simple-centered' as const,
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

export const SimpleLeft = {
  args: {
    ...simpleLeftProps,
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/zsTOcot4CKA5nq2ihg0ZLi/Gather-Ground-Website?node-id=1365-198680',
    },
  },
};

export const SimpleLeftPrimaryOnly = {
  args: {
    variant: 'simple-left' as const,
    heading: simpleLeftProps.heading,
    body: simpleLeftProps.body,
    primaryCta: simpleLeftProps.primaryCta,
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/zsTOcot4CKA5nq2ihg0ZLi/Gather-Ground-Website?node-id=1365-198680',
    },
  },
};

export const CardCentered = {
  args: {
    ...cardCenteredProps,
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/zsTOcot4CKA5nq2ihg0ZLi/Gather-Ground-Website?node-id=1624-435579',
    },
  },
};

export const CardCenteredPrimaryOnly = {
  args: {
    variant: 'card-centered' as const,
    heading: cardCenteredProps.heading,
    body: cardCenteredProps.body,
    primaryCta: cardCenteredProps.primaryCta,
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/zsTOcot4CKA5nq2ihg0ZLi/Gather-Ground-Website?node-id=1624-435579',
    },
  },
};

export const CardLeft = {
  args: {
    ...cardLeftProps,
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/zsTOcot4CKA5nq2ihg0ZLi/Gather-Ground-Website?node-id=1624-435597',
    },
  },
};

export const CardLeftPrimaryOnly = {
  args: {
    variant: 'card-left' as const,
    heading: cardLeftProps.heading,
    body: cardLeftProps.body,
    primaryCta: cardLeftProps.primaryCta,
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/zsTOcot4CKA5nq2ihg0ZLi/Gather-Ground-Website?node-id=1624-435597',
    },
  },
};

export const SplitImage = {
  args: {
    ...splitImageProps,
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/zsTOcot4CKA5nq2ihg0ZLi/Gather-Ground-Website?node-id=1365-198707',
    },
  },
};

export const SplitImagePrimaryOnly = {
  args: {
    variant: 'split-image' as const,
    heading: splitImageProps.heading,
    body: splitImageProps.body,
    primaryCta: splitImageProps.primaryCta,
    image: splitImageProps.image,
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/zsTOcot4CKA5nq2ihg0ZLi/Gather-Ground-Website?node-id=1365-198707',
    },
  },
};
