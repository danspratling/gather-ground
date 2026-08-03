/**
 * useCart — React hook wrapping the nanostores cart atom
 *
 * Provides reactive access to cart state and exposes the mutation helpers.
 * Import in React islands only (`.tsx` files with `client:*` directive).
 */

import { useStore } from '@nanostores/react';
import { cartStore, addToCart, updateCartItem, removeCartItem } from './store';

export function useCart() {
  const cart = useStore(cartStore);
  return {
    items: cart.items,
    subtotal: cart.subtotal,
    total: cart.total,
    count: cart.count,
    isLoading: cart.isLoading,
    addToCart,
    updateCartItem,
    removeCartItem,
  };
}

export default null;
