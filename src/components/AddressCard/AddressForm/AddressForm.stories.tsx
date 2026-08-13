import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from 'storybook/test';
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
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Submit with no values — all required field errors should appear
    await userEvent.click(
      canvas.getByRole('button', { name: /save address/i })
    );

    await expect(
      await canvas.findByText('First name is required')
    ).toBeVisible();
    await expect(
      await canvas.findByText('Last name is required')
    ).toBeVisible();
  },
};

export const EditMode: Story = {
  args: {
    addressId: 'addr-123',
    initialValues: sampleAddress,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Prefilled first name from initialValues
    const firstNameInput = canvas.getByLabelText(/first name/i);
    await expect(firstNameInput).toHaveValue('Jane');

    // Clear first name and try to save — should show validation error
    await userEvent.clear(firstNameInput);
    await userEvent.click(
      canvas.getByRole('button', { name: /update address/i })
    );
    await expect(
      await canvas.findByText('First name is required')
    ).toBeVisible();
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
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const defaultShipping = canvas.getByLabelText(/default shipping/i);
    const defaultBilling = canvas.getByLabelText(/default billing/i);

    await expect(defaultShipping).toBeChecked();
    await expect(defaultBilling).toBeChecked();
  },
};
