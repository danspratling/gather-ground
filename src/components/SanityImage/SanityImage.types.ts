import type { SanityImageCrop, SanityImageHotspot } from '@sanity/image-url';

export interface SanityImageAsset {
  asset: {
    _ref?: string;
    _id?: string;
    url?: string;
  };
  hotspot?: SanityImageHotspot;
  crop?: SanityImageCrop;
}

export interface SanityImageProps {
  asset: SanityImageAsset;
  alt: string;
  width?: number;
  height?: number;
  quality?: number;
  class?: string;
}

export default null;
