// STUB: placeholder until A2b (cart store) merges
// TODO: replace with nanostores implementation from feature/gg-216-gg-217-cart-store-write-api
import type { LineItem } from '@/lib/commerce/types';

export interface UseCartReturn {
  items: LineItem[];
  subtotal: string;
  total: string;
  count: number;
  isLoading: boolean;
  addToCart: (skuCode: string, quantity: number) => Promise<void>;
  updateCartItem: (lineItemId: string, quantity: number) => Promise<void>;
  removeCartItem: (lineItemId: string) => Promise<void>;
}

export function useCart(): UseCartReturn {
  return {
    items: [],
    subtotal: '£0.00',
    total: '£0.00',
    count: 0,
    isLoading: false,
    addToCart: async () => {},
    updateCartItem: async () => {},
    removeCartItem: async () => {},
  };
}
