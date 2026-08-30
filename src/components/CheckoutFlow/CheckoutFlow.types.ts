import type { CartState } from '@/lib/commerce/cart/store';
import type { Address, Customer } from '@/lib/commerce/types';

export type CheckoutStep = 'email' | 'shipping' | 'payment';
export type StepStatus = 'pending' | 'active' | 'complete';

export interface CheckoutState {
  step: CheckoutStep;
  stepStatuses: Record<CheckoutStep, StepStatus>;
  email: string | null;
  shippingAddress: Address | null;
  billingAddress: Address | null;
  shippingMethodId: string | null;
  cartSnapshot: CartState | null;
  cartMutated: boolean;
  error: string | null;
}

export type CheckoutAction =
  | { type: 'SNAPSHOT_CART'; cart: CartState }
  | { type: 'SET_EMAIL'; email: string }
  | { type: 'SET_SHIPPING'; address: Address; shippingMethodId: string }
  | { type: 'SET_PAYMENT'; paymentIntentId: string }
  | { type: 'CART_MUTATED' }
  | { type: 'RESET_TO_STEP'; step: CheckoutStep };

export interface CheckoutFlowProps {
  customer: Customer | null;
}

export const INITIAL_STEP_STATUSES: Record<CheckoutStep, StepStatus> = {
  email: 'active',
  shipping: 'pending',
  payment: 'pending',
};

export const INITIAL_STATE: CheckoutState = {
  step: 'email',
  stepStatuses: INITIAL_STEP_STATUSES,
  email: null,
  shippingAddress: null,
  billingAddress: null,
  shippingMethodId: null,
  cartSnapshot: null,
  cartMutated: false,
  error: null,
};

export default null;
