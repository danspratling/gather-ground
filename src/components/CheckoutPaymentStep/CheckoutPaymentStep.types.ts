import type { Address } from '@/lib/commerce/types';

export interface CheckoutPaymentStepProps {
  shippingAddress: Address;
  onComplete: (paymentIntentId: string) => void;
  /** Storybook override — provide mock clientSecret to skip API call */
  _clientSecret?: string;
}

export default null;
