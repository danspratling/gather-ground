// src/components/ProductGallery/ProductGallery.types.ts

export interface ProductGalleryImage {
  url: string;
  altText?: string;
}

export interface ProductGalleryProps {
  /** Product images from Sanity — drives the full thumbnail rail */
  images: ProductGalleryImage[];
  /** Product title — used as alt text fallback when altText is absent */
  productTitle: string;
  /**
   * Currently selected variant image — shown as hero when set.
   * Replaces the active gallery image in the hero slot; does not
   * appear in the thumbnail rail.
   */
  selectedVariantImage?: ProductGalleryImage;
  class?: string;
}

export default null;
