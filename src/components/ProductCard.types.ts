export type ProductCardVariant = 'category' | 'image-link';

export interface ProductCardProps {
  variant: ProductCardVariant;
  image: string;
  imageAlt: string;
  title: string;
  description?: string;
  href: string;
  class?: string;
}

export default null;
