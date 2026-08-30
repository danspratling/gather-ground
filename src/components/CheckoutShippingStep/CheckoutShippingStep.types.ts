import type { Address, ShippingMethod, Customer } from '@/lib/commerce/types';

export interface CheckoutShippingStepProps {
  customer: Customer | null;
  savedAddresses?: Address[];
  onComplete: (address: Address, shippingMethodId: string) => void;
  /** Storybook/testing override: inject shipping methods instead of fetching */
  _shippingMethods?: ShippingMethod[];
}

export default null;
