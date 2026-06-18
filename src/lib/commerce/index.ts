/**
 * Commerce adapter selector
 *
 * Exports the singleton `commerce` adapter. The implementation is picked at
 * import time from the `COMMERCE_PROVIDER` env var (default: `commercelayer`).
 *
 * All callers MUST import from this module — never reach into a vendor
 * folder directly. This is enforced by `no-restricted-imports` in
 * `eslint.config.js`.
 *
 * Re-exports the public vendor-neutral types so consumers have a single
 * import path for everything commerce-related.
 */

import type { CommerceAdapter } from './adapter';
import { commerceLayerAdapter } from './commercelayer';
import { shopifyAdapter } from './shopify';

export type CommerceProvider = 'commercelayer' | 'shopify';

function resolveProvider(): CommerceProvider {
  const raw = import.meta.env.COMMERCE_PROVIDER ?? 'commercelayer';
  if (raw !== 'commercelayer' && raw !== 'shopify') {
    throw new Error(
      `Unknown COMMERCE_PROVIDER "${raw}". Expected "commercelayer" or "shopify".`
    );
  }
  return raw;
}

function selectAdapter(provider: CommerceProvider): CommerceAdapter {
  switch (provider) {
    case 'commercelayer':
      return commerceLayerAdapter;
    case 'shopify':
      return shopifyAdapter;
  }
}

export const commerceProvider: CommerceProvider = resolveProvider();
export const commerce: CommerceAdapter = selectAdapter(commerceProvider);

export type { CommerceAdapter } from './adapter';
export type {
  Money,
  Variant,
  InventoryStatus,
  Cart,
  LineItem,
  Address,
  ShippingMethod,
  PaymentMethod,
  Order,
  Customer,
} from './types';
export {
  SESSION_COOKIE_NAME,
  getSession,
  setSession,
  clearSession,
  type SessionData,
} from './session';
