// @ts-expect-error — .astro files have no TypeScript declarations
import DetailsIconsFeaturedImage from '@/components/DetailsIconsFeaturedImage/DetailsIconsFeaturedImage.astro';

const mockProps = {
  eyebrow: 'New feature',
  heading: 'Introducing team inboxes',
  body: 'Powerful, self-serve product and growth analytics to help you convert, engage, and retain more users. Trusted by over 4,000 startups.',
  features: [
    {
      icon: 'MessageChatCircle',
      heading: 'Share team inboxes',
      body: 'Whether you have a team of 2 or 200, our shared team inboxes keep everyone on the same page and in the loop.',
    },
    {
      icon: 'ZapFast',
      heading: 'Deliver instant answers',
      body: 'An all-in-one customer service platform that helps you balance everything your customers need to be happy.',
    },
  ],
  image: {
    src: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1216&h=480&fit=crop',
    alt: 'Modern workspace with computer',
  },
};

const meta = {
  title: 'Sections/DetailsIconsFeaturedImage',
  component: DetailsIconsFeaturedImage,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    a11y: { disable: false },
    chromatic: { viewports: [375, 1440] },
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/zsTOcot4CKA5nq2ihg0ZLi/Gather-Ground-Website?node-id=1344-25',
    },
  },
};

export default meta;

export const Default = {
  args: {
    ...mockProps,
    dark: false,
  },
};

export const Dark = {
  args: {
    ...mockProps,
    dark: true,
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/zsTOcot4CKA5nq2ihg0ZLi/Gather-Ground-Website?node-id=18874-96273',
    },
  },
};

export const Mobile = {
  args: {
    ...mockProps,
    dark: false,
  },
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
    chromatic: { viewports: [375] },
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/zsTOcot4CKA5nq2ihg0ZLi/Gather-Ground-Website?node-id=1344-24',
    },
  },
};
