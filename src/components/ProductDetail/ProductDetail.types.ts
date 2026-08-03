import type { Option, Variant } from '@/lib/commerce/types';

export interface ProductDetailProps {
  // Sanity content
  title: string;
  description?: string;
  images: Array<{ url: string; altText?: string }>;

  // Commerce Layer data
  options: Option[]; // variant dimensions (Size, Colour, etc.)
  variants: Variant[]; // all variants with price/inventory
  selectedVariantId?: string; // pre-select a variant (optional)

  class?: string;
}

export default null;
