export interface SanityImageAsset {
  asset: {
    _ref?: string;
    _id?: string;
    url?: string;
  };
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
