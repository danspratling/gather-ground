import type { LineItem } from '@/lib/commerce/types';

export interface CartDrawerProps {
  class?: string;
  /** Testing overrides — not for production use. Override cart items from store. */
  _items?: LineItem[];
  /** Testing overrides — not for production use. Override loading state from store. */
  _isLoading?: boolean;
  /** Testing overrides — not for production use. Start drawer open without needing cart:open event. */
  _isOpen?: boolean;
  /** Testing overrides — not for production use. Override quantity change handler. */
  _onQuantityChange?: (lineItemId: string, quantity: number) => void;
  /** Testing overrides — not for production use. Override remove handler. */
  _onRemove?: (lineItemId: string) => void;
}

export default null;
