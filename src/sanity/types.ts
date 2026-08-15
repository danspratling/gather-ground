/**
 * Sanity document shapes for the commerce catalog.
 *
 * These types mirror the Sanity schema definitions in src/sanity/schemas/.
 * They are distinct from vendor-neutral types in src/lib/commerce/types.ts.
 * The mapper in src/lib/commerce/commercelayer/mapper.ts bridges the two.
 */

import type { InventoryStatus } from '../lib/commerce/types';

// ─── Shared sub-types ────────────────────────────────────────────────────────

export interface SanityImageAsset {
  url: string;
  alt?: string;
}

export interface SanityPriceObject {
  amount: number; // in smallest currency unit (pence for GBP)
  currency: string; // ISO 4217 (e.g. 'GBP')
}

export interface SanityOptionValue {
  optionName: string;
  value: string;
}

export interface SanityProductOption {
  name: string;
  values: string[];
}

// ─── ProductVariant document ─────────────────────────────────────────────────

export interface SanityProductVariant {
  _id: string;
  _type: 'productVariant';
  sku: string;
  parentProduct?: {
    _id: string;
    title: string;
    slug: string;
    featuredImage?: SanityImageAsset;
  };
  optionValues: SanityOptionValue[];
  price: SanityPriceObject;
  compareAtPrice?: SanityPriceObject;
  taxCategory: 'vat-uk-20' | 'vat-uk-0';
  weight?: number; // grams
  dimensions?: {
    length?: number; // cm
    width?: number; // cm
    height?: number; // cm
  };
  /** Read-only, synced from Commerce Layer. Never set by editors. */
  inventoryStatus?: InventoryStatus;
  images?: SanityImageAsset[];
}

// ─── Products document ───────────────────────────────────────────────────────

export interface SanityProduct {
  _id: string;
  _type: 'products';
  title: string;
  slug: string;
  commerceEnabled: boolean;
  options?: SanityProductOption[];
  variants?: SanityProductVariant[];
  defaultVariant?: SanityProductVariant;
  // Editorial fields
  featuredImage?: SanityImageAsset;
  metaDescription?: string;
}

export default null;
