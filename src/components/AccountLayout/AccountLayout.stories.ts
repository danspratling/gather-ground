// @storybook-astro/framework does not export Meta/StoryObj — Astro stories are untyped by design.
// See: https://storybook-astro.org/writing-stories/
import AccountLayout from '@/components/AccountLayout/AccountLayout.astro';

const meta = {
  title: 'Account/AccountLayout',
  component: AccountLayout,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    a11y: { disable: false },
    chromatic: { viewports: [375, 1440] },
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/zsTOcot4CKA5nq2ihg0ZLi/Gather-Ground-Website?node-id=0-1',
    },
  },
};

export default meta;

export const Default = {
  args: {
    customerName: 'Jane',
    pathname: '/account',
  },
};

export const OnOrders = {
  args: {
    customerName: 'Jane',
    pathname: '/account/orders',
  },
};

export const MobileTabbed = {
  args: {
    customerName: 'Jane',
    pathname: '/account',
  },
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
  },
};
