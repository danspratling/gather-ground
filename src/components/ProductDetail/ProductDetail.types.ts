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

  /**
   * When false, the ecommerce buy-box (price, variant picker, add-to-cart)
   * is hidden and only the Sanity content (gallery, title, description) shows.
   * Defaults to true.
   */
  commerceEnabled?: boolean;

  class?: string;
}

export default null;
