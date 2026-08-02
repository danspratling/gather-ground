export type ProductCardVariant = 'category' | 'image-link' | 'commerce';

export interface ProductCardProps {
  variant: ProductCardVariant;
  image: string;
  imageAlt: string;
  title: string;
  description?: string;
  href: string;
  price?: string;
  compareAtPrice?: string;
  inventoryStatus?: 'in_stock' | 'low_stock' | 'out_of_stock';
  badge?: string;
  class?: string;
}

export default null;
