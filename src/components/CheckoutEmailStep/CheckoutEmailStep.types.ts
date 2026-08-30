import type { Customer } from '@/lib/commerce/types';

export interface CheckoutEmailStepProps {
  customer: Customer | null;
  onComplete: (email: string) => void;
  /** Storybook override — sets the initial status state */
  _status?: 'idle' | 'submitting' | 'error';
}

export default null;
