import type { Meta, StoryObj } from '@storybook/react';
import AddressForm from './AddressForm';
import type { AddressFormValues } from './AddressForm.types';

const meta = {
  title: 'Account/AddressForm',
  component: AddressForm,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    renderer: 'react',
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/zsTOcot4CKA5nq2ihg0ZLi/Gather-Ground-Website?node-id=0-1',
    },
  },
} satisfies Meta<typeof AddressForm>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleAddress: AddressFormValues = {
  firstName: 'Jane',
  lastName: 'Smith',
  line1: '123 Farm Lane',
  line2: 'Unit 4',
  city: 'London',
  postcode: 'EC1A 1BB',
  country: 'United Kingdom',
  phone: '+44 7700 900000',
};

export const Empty: Story = {
  args: {},
};

export const EditMode: Story = {
  args: {
    addressId: 'addr-123',
    initialValues: sampleAddress,
  },
};

export const WithDefaultsPreset: Story = {
  args: {
    initialValues: {
      ...sampleAddress,
      isDefaultShipping: true,
      isDefaultBilling: true,
    },
  },
};
