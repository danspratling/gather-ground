// @ts-expect-error — .astro files have no TypeScript declarations
import DetailsTitle from '@/components/DetailsTitle/DetailsTitle.astro';

const mockProps = {
  eyebrow: 'Features',
  heading: 'Overflowing with useful features',
  body: 'Powerful, self-serve product and growth analytics to help you convert, engage, and retain more users. Trusted by over 4,000 startups.',
};

const meta = {
  title: 'Sections/DetailsTitle',
  component: DetailsTitle,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    a11y: { disable: false },
    chromatic: { viewports: [375, 1440] },
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/zsTOcot4CKA5nq2ihg0ZLi/Gather-Ground-Website?node-id=18874-96185',
    },
  },
};

export default meta;

export const Left = {
  args: {
    ...mockProps,
    align: 'left' as const,
    dark: false,
  },
};

export const Centered = {
  args: {
    ...mockProps,
    heading: 'Beautiful analytics to grow smarter',
    align: 'center' as const,
    dark: false,
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/zsTOcot4CKA5nq2ihg0ZLi/Gather-Ground-Website?node-id=18874-95933',
    },
  },
};

export const Dark = {
  args: {
    ...mockProps,
    align: 'left' as const,
    dark: true,
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/zsTOcot4CKA5nq2ihg0ZLi/Gather-Ground-Website?node-id=18874-96433',
    },
  },
};

export const DarkCentered = {
  args: {
    ...mockProps,
    heading: 'Beautiful analytics to grow smarter',
    align: 'center' as const,
    dark: true,
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/zsTOcot4CKA5nq2ihg0ZLi/Gather-Ground-Website?node-id=18874-96409',
    },
  },
};

export const Mobile = {
  args: {
    ...mockProps,
    align: 'center' as const,
    dark: false,
  },
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
    chromatic: { viewports: [375] },
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/zsTOcot4CKA5nq2ihg0ZLi/Gather-Ground-Website?node-id=18874-96049',
    },
  },
};
