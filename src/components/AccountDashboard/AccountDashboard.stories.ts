// @storybook-astro/framework does not export Meta/StoryObj — Astro stories are untyped by design.
// See: https://storybook-astro.org/writing-stories/
import AccountDashboard from '@/components/AccountDashboard/AccountDashboard.astro';

const meta = {
  title: 'Account/AccountDashboard',
  component: AccountDashboard,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    a11y: { disable: false },
    chromatic: { viewports: [375, 1440] },
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/zsTOcot4CKA5nq2ihg0ZLi/Gather-Ground-Website?node-id=0-1',
    },
  },
};

export default meta;

const sampleAddress = {
  firstName: 'Jane',
  lastName: 'Smith',
  line1: '123 Farm Lane',
  line2: 'Unit 4',
  city: 'London',
  postcode: 'EC1A 1BB',
  country: 'United Kingdom',
  isDefaultShipping: true,
};

export const Default = {
  args: {
    customerName: 'Jane',
    defaultAddress: sampleAddress,
  },
};

export const NoAddress = {
  args: {
    customerName: 'Jane',
    defaultAddress: undefined,
  },
};

export const EmptyState = {
  args: {
    customerName: 'New Customer',
    defaultAddress: undefined,
  },
};
