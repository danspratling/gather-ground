/**
 * Sanity → vendor-neutral commerce type mapper
 *
 * Bridges SanityProductVariant shapes (from GROQ queries) to the
 * vendor-neutral Variant type used by the application.
 * CL catalog data (live price + inventory) is supplied by the caller
 * after fetching via the catalog adapter.
 */

import type { Variant, Money, InventoryStatus } from '../types';
import type {
  SanityProductVariant,
  SanityPriceObject,
} from '../../../sanity/types';

function mapSanityPrice(price: SanityPriceObject): Money {
  return {
    amount: price.amount,
    currency: price.currency,
    formatted: new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: price.currency,
    }).format(price.amount / 100),
  };
}

/**
 * Map a Sanity variant document + live CL data to the vendor-neutral Variant type.
 *
 * @param sanityVariant - Variant document fetched from Sanity
 * @param clInventory   - Live inventory status fetched from Commerce Layer
 * @param clPrice       - Live price fetched from Commerce Layer
 */
export function mapSanityVariantToCommerce(
  sanityVariant: SanityProductVariant,
  clInventory: InventoryStatus,
  clPrice: Money
): Variant {
  return {
    id: sanityVariant._id,
    name: sanityVariant.optionValues.map((v) => v.value).join(' / '),
    sku: sanityVariant.sku,
    price: clPrice,
    compareAtPrice: sanityVariant.compareAtPrice
      ? mapSanityPrice(sanityVariant.compareAtPrice)
      : undefined,
    selectedOptions: Object.fromEntries(
      sanityVariant.optionValues.map((v): [string, string] => [
        v.optionName,
        v.value,
      ])
    ),
    inventoryStatus: clInventory,
    weight: sanityVariant.weight,
  };
}
