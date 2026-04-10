// @ts-expect-error — .astro files have no TypeScript declarations
import Content from '@/components/Content/Content.astro';

const mockFeatures = [
  {
    heading: 'Share team inboxes',
    body: 'Whether you have a team of 2 or 200, our shared team inboxes keep everyone on the same page and in the loop.',
  },
  {
    heading: 'Deliver instant answers',
    body: 'An all-in-one customer service platform that helps you balance everything your customers need to be happy.',
  },
  {
    heading: 'Manage your team with reports',
    body: "Measure what matters with Untitled's easy-to-use reports. You can filter, export, and drilldown on the data in a couple clicks.",
  },
  {
    heading: 'Our people make the difference',
    body: "We're an extension of your customer service team, and all of our resources are free. Chat to our friendly team 24/7 when you need help.",
  },
  {
    heading: 'Connect the tools you already use',
    body: 'Explore 100+ integrations that make your day-to-day workflow more efficient and familiar. Plus, our extensive developer tools.',
  },
  {
    heading: 'Connect with customers',
    body: 'Solve a problem or close a sale in real-time with chat. If no one is available, customers are seamlessly routed to email without confusion.',
  },
];

const meta = {
  title: 'Sections/Content',
  component: Content,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    a11y: { disable: false },
    chromatic: { viewports: [375, 1440] },
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/zsTOcot4CKA5nq2ihg0ZLi/Gather-Ground-Website?node-id=1344-9',
    },
  },
};

export default meta;

export const Simple = {
  args: {
    variant: 'simple' as const,
    icon: 'ZapFast',
    heading: 'Beautiful analytics to grow smarter',
    body: 'Powerful, self-serve product and growth analytics to help you convert, engage, and retain more users.',
    features: mockFeatures,
    dark: false,
  },
};

export const SimpleDark = {
  args: {
    ...Simple.args,
    dark: true,
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/zsTOcot4CKA5nq2ihg0ZLi/Gather-Ground-Website?node-id=18874-95777',
    },
  },
};

export const Alternating = {
  args: {
    variant: 'alternating' as const,
    icon: 'MessageChatCircle',
    heading: 'Share team inboxes',
    body: 'Whether you have a team of 2 or 200, our shared team inboxes keep everyone on the same page and in the loop.',
    checklistItems: [
      'Leverage automation to move fast',
      'Always give customers a human to chat to',
      'Automate customer support and close leads faster',
    ],
    image: {
      src: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=640&h=480&fit=crop',
      alt: 'Modern workspace with computer',
    },
    imagePosition: 'right' as const,
    dark: false,
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/zsTOcot4CKA5nq2ihg0ZLi/Gather-Ground-Website?node-id=1344-4',
    },
  },
};

export const AlternatingImageLeft = {
  args: {
    ...Alternating.args,
    imagePosition: 'left' as const,
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/zsTOcot4CKA5nq2ihg0ZLi/Gather-Ground-Website?node-id=18874-95865',
    },
  },
};

export const AlternatingDark = {
  args: {
    ...Alternating.args,
    dark: true,
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/zsTOcot4CKA5nq2ihg0ZLi/Gather-Ground-Website?node-id=18874-95971',
    },
  },
};

const mockIconFeatures = [
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
];

export const IconsFeaturedImage = {
  args: {
    variant: 'icons-featured-image' as const,
    eyebrow: 'New feature',
    heading: 'Introducing team inboxes',
    body: 'Powerful, self-serve product and growth analytics to help you convert, engage, and retain more users. Trusted by over 4,000 startups.',
    features: mockIconFeatures,
    image: {
      src: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1216&h=480&fit=crop',
      alt: 'Modern workspace with computer',
    },
    dark: false,
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/zsTOcot4CKA5nq2ihg0ZLi/Gather-Ground-Website?node-id=1344-25',
    },
  },
};

export const IconsFeaturedImageDark = {
  args: {
    ...IconsFeaturedImage.args,
    dark: true,
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/zsTOcot4CKA5nq2ihg0ZLi/Gather-Ground-Website?node-id=18874-96273',
    },
  },
};

const mockTitleProps = {
  variant: 'title' as const,
  eyebrow: 'Features',
  heading: 'Overflowing with useful features',
  body: 'Powerful, self-serve product and growth analytics to help you convert, engage, and retain more users. Trusted by over 4,000 startups.',
};

export const TitleLeft = {
  args: {
    ...mockTitleProps,
    align: 'left' as const,
    dark: false,
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/zsTOcot4CKA5nq2ihg0ZLi/Gather-Ground-Website?node-id=18874-96185',
    },
  },
};

export const TitleCentered = {
  args: {
    ...mockTitleProps,
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

export const TitleDark = {
  args: {
    ...mockTitleProps,
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

export const TitleDarkCentered = {
  args: {
    ...mockTitleProps,
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
