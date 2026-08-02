// @storybook-astro/framework does not export Meta/StoryObj — Astro stories are untyped by design.
// See: https://storybook-astro.org/writing-stories/
import AddressList from '@/components/AddressCard/AddressList/AddressList.astro';

const meta = {
  title: 'Account/AddressList',
  component: AddressList,
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

const sampleAddresses = [
  {
    id: 'addr-1',
    firstName: 'Jane',
    lastName: 'Smith',
    line1: '123 Farm Lane',
    city: 'London',
    postcode: 'EC1A 1BB',
    country: 'United Kingdom',
    isDefaultShipping: true,
  },
  {
    id: 'addr-2',
    firstName: 'Jane',
    lastName: 'Smith',
    line1: '456 Country Road',
    city: 'Bristol',
    postcode: 'BS1 4DJ',
    country: 'United Kingdom',
  },
];

export const WithAddresses = {
  args: { addresses: sampleAddresses },
};

export const Empty = {
  args: { addresses: [] },
};
