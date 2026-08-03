import type { LineItem } from '@/lib/commerce/types';

export interface CartDrawerProps {
  class?: string;
  /** Testing overrides — not for production use. Override cart items from store. */
  _items?: LineItem[];
  /** Testing overrides — not for production use. Override loading state from store. */
  _isLoading?: boolean;
  /** Testing overrides — not for production use. Start drawer open without needing cart:open event. */
  _isOpen?: boolean;
}

export default null;
