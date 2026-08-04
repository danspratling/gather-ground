/**
 * Client-side cart store
 *
 * A nanostores atom holding the current cart state. Persists across page
 * navigations because it lives at module scope (SPA-style hydration).
 *
 * The mutation functions (addToCart, updateCartItem, removeCartItem) call the
 * write API routes and update the atom with the response. They are safe to
 * import on the server — window access is guarded inside functions.
 */

import { atom } from 'nanostores';
import type { Cart, LineItem } from '@/lib/commerce/types';

export interface CartState {
  id: string | null;
  items: LineItem[];
  subtotal: string; // formatted string (e.g. "£24.98")
  total: string; // formatted string
  count: number; // total item quantity
  isLoading: boolean;
}

export const cartStore = atom<CartState>({
  id: null,
  items: [],
  subtotal: '£0.00',
  total: '£0.00',
  count: 0,
  isLoading: false,
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Map a Cart response → CartState and write to the atom. */
export function setCartFromResponse(cart: Cart): void {
  const count = cart.lineItems.reduce((sum, item) => sum + item.quantity, 0);
  cartStore.set({
    id: cart.id,
    items: cart.lineItems,
    subtotal: cart.subtotal.formatted,
    total: cart.total.formatted,
    count,
    isLoading: false,
  });

  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('cart:updated', { detail: { itemCount: count } })
    );
  }
}

/** Update the isLoading flag without touching other state. */
export function setCartLoading(loading: boolean): void {
  cartStore.set({ ...cartStore.get(), isLoading: loading });
}

/**
 * Initialise the cart store from the server.
 * Calls GET /api/commerce/cart once on mount (called by CartDrawer or CartTrigger).
 * No-op if the store already has a cart ID (prevents double-init).
 */
export async function initCart(): Promise<void> {
  if (cartStore.get().id !== null) return; // already initialised

  setCartLoading(true);
  try {
    const res = await fetch('/api/commerce/cart');
    if (!res.ok) return;
    const cart = (await res.json()) as Cart;
    setCartFromResponse(cart);
  } catch {
    // Silently fail — cart will initialise on next mutation
  } finally {
    setCartLoading(false);
  }
}

// ---------------------------------------------------------------------------
// Mutations — call write API routes then update the store
// ---------------------------------------------------------------------------

/** Add a SKU to the cart (creates a new cart if none exists). */
export async function addToCart(
  skuCode: string,
  quantity: number
): Promise<void> {
  setCartLoading(true);
  try {
    const res = await fetch('/api/commerce/cart/items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ skuCode, quantity }),
    });
    if (!res.ok) {
      throw new Error(`addToCart failed: ${res.status}`);
    }
    const cart = (await res.json()) as Cart;
    setCartFromResponse(cart);
  } finally {
    setCartLoading(false);
  }
}

/** Update the quantity of an existing line item. */
export async function updateCartItem(
  lineItemId: string,
  quantity: number
): Promise<void> {
  setCartLoading(true);
  try {
    const res = await fetch('/api/commerce/cart/items', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lineItemId, quantity }),
    });
    if (!res.ok) {
      throw new Error(`updateCartItem failed: ${res.status}`);
    }
    const cart = (await res.json()) as Cart;
    setCartFromResponse(cart);
  } finally {
    setCartLoading(false);
  }
}

/** Remove a line item from the cart. */
export async function removeCartItem(lineItemId: string): Promise<void> {
  setCartLoading(true);
  try {
    const res = await fetch('/api/commerce/cart/items', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lineItemId }),
    });
    if (!res.ok) {
      throw new Error(`removeCartItem failed: ${res.status}`);
    }
    const cart = (await res.json()) as Cart;
    setCartFromResponse(cart);
  } finally {
    setCartLoading(false);
  }
}

export default null;
