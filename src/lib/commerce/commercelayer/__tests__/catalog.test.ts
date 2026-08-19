/**
 * Tests for Commerce Layer catalog adapter
 *
 * Mocks getSalesChannelClient to isolate catalog functions from the network.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { CommerceLayerBundle } from '@commercelayer/sdk/bundle';
import * as catalogAdapter from '../catalog';

vi.mock('../client', () => ({
  getSalesChannelClient: vi.fn(),
}));

import { getSalesChannelClient } from '../client';

// ---------------------------------------------------------------------------
// Tests — getVariantInventory
// ---------------------------------------------------------------------------

describe('getVariantInventory', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns in_stock when totalOnHand > 5', async () => {
    vi.mocked(getSalesChannelClient).mockResolvedValue({
      skus: {
        list: vi.fn().mockResolvedValue([{ stock_items: [{ quantity: 10 }] }]),
      },
    } as unknown as CommerceLayerBundle);

    const result = await catalogAdapter.getVariantInventory('SKU001');

    expect(result).toBe('in_stock');
  });

  it('returns low_stock when totalOnHand is between 1 and 5', async () => {
    vi.mocked(getSalesChannelClient).mockResolvedValue({
      skus: {
        list: vi.fn().mockResolvedValue([{ stock_items: [{ quantity: 3 }] }]),
      },
    } as unknown as CommerceLayerBundle);

    const result = await catalogAdapter.getVariantInventory('SKU001');

    expect(result).toBe('low_stock');
  });

  it('returns out_of_stock when totalOnHand is 0', async () => {
    vi.mocked(getSalesChannelClient).mockResolvedValue({
      skus: {
        list: vi.fn().mockResolvedValue([{ stock_items: [{ quantity: 0 }] }]),
      },
    } as unknown as CommerceLayerBundle);

    const result = await catalogAdapter.getVariantInventory('SKU001');

    expect(result).toBe('out_of_stock');
  });

  it('returns out_of_stock when SKU not found', async () => {
    vi.mocked(getSalesChannelClient).mockResolvedValue({
      skus: {
        list: vi.fn().mockResolvedValue([]),
      },
    } as unknown as CommerceLayerBundle);

    const result = await catalogAdapter.getVariantInventory('UNKNOWN');

    expect(result).toBe('out_of_stock');
  });
});

// ---------------------------------------------------------------------------
// Tests — getVariantPrice
// ---------------------------------------------------------------------------

describe('getVariantPrice', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns a Money object with correct amount, currency, and formatted string', async () => {
    vi.mocked(getSalesChannelClient).mockResolvedValue({
      prices: {
        list: vi.fn().mockResolvedValue([
          {
            amount_cents: 1999,
            currency_code: 'GBP',
            formatted_amount: '£19.99',
          },
        ]),
      },
    } as unknown as CommerceLayerBundle);

    const result = await catalogAdapter.getVariantPrice('SKU001');

    expect(result.amount).toBe(1999);
    expect(result.currency).toBe('GBP');
    expect(result.formatted).toBe('£19.99');
  });

  it('throws when no price found for SKU', async () => {
    vi.mocked(getSalesChannelClient).mockResolvedValue({
      prices: {
        list: vi.fn().mockResolvedValue([]),
      },
    } as unknown as CommerceLayerBundle);

    await expect(catalogAdapter.getVariantPrice('UNKNOWN')).rejects.toThrow(
      'No price found for SKU: UNKNOWN'
    );
  });
});
