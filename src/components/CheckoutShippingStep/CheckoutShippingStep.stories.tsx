import type { Meta, StoryObj } from '@storybook/react';
import { CheckoutShippingStep } from './CheckoutShippingStep';
import type { Address, ShippingMethod, Customer } from '@/lib/commerce/types';

const mockAddress1: Address = {
  id: 'addr-1',
  firstName: 'Jane',
  lastName: 'Smith',
  line1: '123 Farm Lane',
  line2: 'Unit 4',
  city: 'London',
  postalCode: 'EC1A 1BB',
  country: 'United Kingdom',
  phone: '+44 7700 900000',
};

const mockAddress2: Address = {
  id: 'addr-2',
  firstName: 'Jane',
  lastName: 'Smith',
  line1: '45 Rural Road',
  city: 'Bristol',
  postalCode: 'BS1 2AB',
  country: 'United Kingdom',
};

const mockCustomer: Customer = {
  id: 'customer-1',
  email: 'jane@example.com',
  firstName: 'Jane',
  lastName: 'Smith',
  addresses: [mockAddress1, mockAddress2],
  defaultShippingAddressId: 'addr-1',
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
};

const mockShippingMethods: ShippingMethod[] = [
  {
    id: 'method-standard',
    name: 'Standard Delivery',
    cost: { amount: 395, currency: 'GBP', formatted: '£3.95' },
    estimatedDays: 5,
  },
  {
    id: 'method-express',
    name: 'Express Delivery',
    cost: { amount: 795, currency: 'GBP', formatted: '£7.95' },
    estimatedDays: 2,
  },
];

const meta: Meta<typeof CheckoutShippingStep> = {
  title: 'Checkout/CheckoutShippingStep',
  component: CheckoutShippingStep,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    renderer: 'react',
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/zsTOcot4CKA5nq2ihg0ZLi/Gather-Ground-Website?node-id=0-1',
    },
    chromatic: { viewports: [375, 1440] },
  },
};

export default meta;
type Story = StoryObj<typeof CheckoutShippingStep>;

/** Guest user — address form only, no saved addresses */
export const Guest: Story = {
  args: {
    customer: null,
    savedAddresses: [],
    onComplete: (address, methodId) =>
      console.log('Checkout step complete', { address, methodId }),
  },
};

/** Logged-in user with saved addresses — radio card selector shown first */
export const LoggedInSavedAddresses: Story = {
  args: {
    customer: mockCustomer,
    savedAddresses: [mockAddress1, mockAddress2],
    onComplete: (address, methodId) =>
      console.log('Checkout step complete', { address, methodId }),
    _shippingMethods: mockShippingMethods,
  },
};

/** Logged-in user who clicks "Use a new address" — inline form revealed */
export const LoggedInNewAddress: Story = {
  args: {
    customer: mockCustomer,
    savedAddresses: [mockAddress1],
    onComplete: (address, methodId) =>
      console.log('Checkout step complete', { address, methodId }),
    _shippingMethods: mockShippingMethods,
  },
};

/**
 * No shipping methods available for the given address.
 * Inject an empty array via _shippingMethods so the "no methods" message is shown
 * without a network call. Requires the component to already be in shipping-methods mode.
 */
export const NoShippingMethods: Story = {
  args: {
    customer: null,
    savedAddresses: [],
    onComplete: (address, methodId) =>
      console.log('Checkout step complete', { address, methodId }),
    _shippingMethods: [],
  },
};
