/**
 * Tests for cart cookie helpers
 */

import { describe, it, expect } from 'vitest';
import type { AstroCookies } from 'astro';
import { getCartId, setCartId, clearCartId } from '../cookies';

interface StoredCookie {
  value: string;
  options?: Record<string, unknown>;
}

function createMockCookies(): {
  cookies: AstroCookies;
  store: Map<string, StoredCookie>;
} {
  const store = new Map<string, StoredCookie>();
  const cookies = {
    get(name: string) {
      const entry = store.get(name);
      return entry ? { value: entry.value } : undefined;
    },
    set(name: string, value: string, options?: Record<string, unknown>) {
      store.set(name, { value, options });
    },
    delete(name: string) {
      store.delete(name);
    },
  } as unknown as AstroCookies;
  return { cookies, store };
}

describe('getCartId', () => {
  it('returns undefined when no cookie is set', () => {
    const { cookies } = createMockCookies();
    expect(getCartId(cookies)).toBeUndefined();
  });

  it('returns the cart ID when cookie is present', () => {
    const { cookies, store } = createMockCookies();
    store.set('gg_cart', { value: 'cart-abc-123' });
    expect(getCartId(cookies)).toBe('cart-abc-123');
  });
});

describe('setCartId', () => {
  it('writes the cart ID with correct cookie options', () => {
    const { cookies, store } = createMockCookies();
    setCartId(cookies, 'cart-xyz-456');
    const entry = store.get('gg_cart');
    expect(entry?.value).toBe('cart-xyz-456');
    expect(entry?.options?.httpOnly).toBe(true);
    expect(entry?.options?.sameSite).toBe('lax');
    expect(entry?.options?.maxAge).toBe(2592000);
    expect(entry?.options?.path).toBe('/');
  });
});

describe('clearCartId', () => {
  it('removes the cart cookie', () => {
    const { cookies, store } = createMockCookies();
    store.set('gg_cart', { value: 'cart-to-delete' });
    clearCartId(cookies);
    expect(store.has('gg_cart')).toBe(false);
  });
});
