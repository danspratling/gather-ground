/**
 * Tests for cart store mutation functions
 *
 * Mocks global.fetch so mutations can be exercised without a real server.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { Cart } from '../../types';
import {
  cartStore,
  addToCart,
  updateCartItem,
  removeCartItem,
  setCartFromResponse,
} from '../store';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const sampleCart: Cart = {
  id: 'cart-001',
  lineItems: [
    {
      id: 'li-1',
      variantId: 'sku-001',
      quantity: 2,
      price: { amount: 999, currency: 'GBP', formatted: '£9.99' },
      subtotal: { amount: 1998, currency: 'GBP', formatted: '£19.98' },
      selectedOptions: {},
    },
  ],
  subtotal: { amount: 1998, currency: 'GBP', formatted: '£19.98' },
  total: { amount: 1998, currency: 'GBP', formatted: '£19.98' },
};

const emptyCart: Cart = {
  id: 'cart-001',
  lineItems: [],
  subtotal: { amount: 0, currency: 'GBP', formatted: '£0.00' },
  total: { amount: 0, currency: 'GBP', formatted: '£0.00' },
};

function mockFetchSuccess(cart: Cart) {
  return vi.spyOn(global, 'fetch').mockResolvedValueOnce(
    new Response(JSON.stringify(cart), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  );
}

function mockFetchError(status = 500) {
  return vi
    .spyOn(global, 'fetch')
    .mockResolvedValueOnce(
      new Response(JSON.stringify({ error: 'server error' }), { status })
    );
}

// ---------------------------------------------------------------------------
// Reset store before each test
// ---------------------------------------------------------------------------

beforeEach(() => {
  cartStore.set({
    id: null,
    items: [],
    subtotal: '£0.00',
    total: '£0.00',
    count: 0,
    isLoading: false,
  });
  vi.restoreAllMocks();
});

// ---------------------------------------------------------------------------
// setCartFromResponse
// ---------------------------------------------------------------------------

describe('setCartFromResponse', () => {
  it('maps Cart to CartState correctly', () => {
    setCartFromResponse(sampleCart);
    const state = cartStore.get();
    expect(state.id).toBe('cart-001');
    expect(state.items).toHaveLength(1);
    expect(state.subtotal).toBe('£19.98');
    expect(state.total).toBe('£19.98');
    expect(state.count).toBe(2);
    expect(state.isLoading).toBe(false);
  });

  it('dispatches cart:updated event with itemCount', () => {
    const handler = vi.fn();
    window.addEventListener('cart:updated', handler);
    setCartFromResponse(sampleCart);
    expect(handler).toHaveBeenCalledOnce();
    expect((handler.mock.calls[0][0] as CustomEvent).detail.itemCount).toBe(2);
    window.removeEventListener('cart:updated', handler);
  });
});

// ---------------------------------------------------------------------------
// addToCart
// ---------------------------------------------------------------------------

describe('addToCart', () => {
  it('sets isLoading=true during the call then false after success', async () => {
    const loading: boolean[] = [];
    const unsubscribe = cartStore.subscribe((state) =>
      loading.push(state.isLoading)
    );
    mockFetchSuccess(sampleCart);

    await addToCart('sku-001', 2);
    unsubscribe();

    expect(loading).toContain(true);
    expect(loading[loading.length - 1]).toBe(false);
  });

  it('updates store state with response items', async () => {
    mockFetchSuccess(sampleCart);
    await addToCart('sku-001', 2);

    const state = cartStore.get();
    expect(state.items).toHaveLength(1);
    expect(state.items[0].variantId).toBe('sku-001');
    expect(state.count).toBe(2);
  });

  it('dispatches cart:updated event with correct itemCount', async () => {
    const handler = vi.fn();
    window.addEventListener('cart:updated', handler);
    mockFetchSuccess(sampleCart);
    await addToCart('sku-001', 2);
    expect(handler).toHaveBeenCalledOnce();
    expect((handler.mock.calls[0][0] as CustomEvent).detail.itemCount).toBe(2);
    window.removeEventListener('cart:updated', handler);
  });

  it('sets isLoading=false after a fetch error', async () => {
    mockFetchError();
    await expect(addToCart('sku-001', 1)).rejects.toThrow();
    expect(cartStore.get().isLoading).toBe(false);
  });

  it('sends a POST request with correct body', async () => {
    const fetchSpy = mockFetchSuccess(sampleCart);
    await addToCart('sku-001', 3);

    const [url, opts] = fetchSpy.mock.calls[0] as [string, RequestInit];
    expect(url).toBe('/api/commerce/cart/items');
    expect(opts.method).toBe('POST');
    expect(JSON.parse(opts.body as string)).toEqual({
      skuCode: 'sku-001',
      quantity: 3,
    });
  });
});

// ---------------------------------------------------------------------------
// updateCartItem
// ---------------------------------------------------------------------------

describe('updateCartItem', () => {
  it('updates item quantity in store', async () => {
    const updatedCart: Cart = {
      ...sampleCart,
      lineItems: [{ ...sampleCart.lineItems[0], quantity: 5 }],
    };
    mockFetchSuccess(updatedCart);
    await updateCartItem('li-1', 5);

    expect(cartStore.get().items[0].quantity).toBe(5);
    expect(cartStore.get().count).toBe(5);
  });

  it('sends a PATCH request with correct body', async () => {
    const fetchSpy = mockFetchSuccess(sampleCart);
    await updateCartItem('li-1', 3);

    const [url, opts] = fetchSpy.mock.calls[0] as [string, RequestInit];
    expect(url).toBe('/api/commerce/cart/items');
    expect(opts.method).toBe('PATCH');
    expect(JSON.parse(opts.body as string)).toEqual({
      lineItemId: 'li-1',
      quantity: 3,
    });
  });

  it('sets isLoading=false after error', async () => {
    mockFetchError();
    await expect(updateCartItem('li-1', 1)).rejects.toThrow();
    expect(cartStore.get().isLoading).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// removeCartItem
// ---------------------------------------------------------------------------

describe('removeCartItem', () => {
  it('removes item from store', async () => {
    // Seed the store with an item first
    setCartFromResponse(sampleCart);
    mockFetchSuccess(emptyCart);
    await removeCartItem('li-1');

    expect(cartStore.get().items).toHaveLength(0);
    expect(cartStore.get().count).toBe(0);
  });

  it('sends a DELETE request with correct body', async () => {
    const fetchSpy = mockFetchSuccess(emptyCart);
    await removeCartItem('li-1');

    const [url, opts] = fetchSpy.mock.calls[0] as [string, RequestInit];
    expect(url).toBe('/api/commerce/cart/items');
    expect(opts.method).toBe('DELETE');
    expect(JSON.parse(opts.body as string)).toEqual({ lineItemId: 'li-1' });
  });

  it('sets isLoading=false after error', async () => {
    mockFetchError();
    await expect(removeCartItem('li-1')).rejects.toThrow();
    expect(cartStore.get().isLoading).toBe(false);
  });
});
