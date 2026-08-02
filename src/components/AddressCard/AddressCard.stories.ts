// @storybook-astro/framework does not export Meta/StoryObj — Astro stories are untyped by design.
// See: https://storybook-astro.org/writing-stories/
import AddressCard from '@/components/AddressCard/AddressCard.astro';

const meta = {
  title: 'Account/AddressCard',
  component: AddressCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
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
};

export const Default = {
  args: {
    address: sampleAddress,
  },
};

export const DefaultShipping = {
  args: {
    address: { ...sampleAddress, isDefaultShipping: true },
  },
};

export const DefaultBilling = {
  args: {
    address: { ...sampleAddress, isDefaultBilling: true },
  },
};

export const BothDefaults = {
  args: {
    address: {
      ...sampleAddress,
      isDefaultShipping: true,
      isDefaultBilling: true,
    },
  },
};
