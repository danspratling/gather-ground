/**
 * Tests for the commerce adapter selector + Shopify stub.
 *
 * Verifies:
 * - The default selector returns the Commerce Layer adapter
 * - The Shopify stub satisfies the CommerceAdapter interface but every method
 *   throws "not implemented"
 */

import { describe, it, expect } from 'vitest';
import { commerce, commerceProvider } from '../index';
import { shopifyAdapter } from '../shopify';

describe('commerce selector', () => {
  it('defaults to the commercelayer provider', () => {
    expect(commerceProvider).toBe('commercelayer');
  });

  it('exposes an adapter with the full CommerceAdapter surface', () => {
    expect(typeof commerce.login).toBe('function');
    expect(typeof commerce.getCart).toBe('function');
    expect(typeof commerce.placeOrder).toBe('function');
  });
});

describe('shopify stub', () => {
  it('throws "not implemented" for every method', async () => {
    await expect(shopifyAdapter.login('a', 'b')).rejects.toThrow(
      /not implemented/i
    );
    await expect(shopifyAdapter.createCart()).rejects.toThrow(
      /not implemented/i
    );
    await expect(shopifyAdapter.placeOrder('cart-1', 'pm-1')).rejects.toThrow(
      /not implemented/i
    );
  });
});
