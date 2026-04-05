export type ProductsSectionVariant = 'cards' | 'carousel';

export interface ProductsSectionProduct {
  image: string;
  imageAlt: string;
  title: string;
  description?: string;
  href: string;
}

export interface ProductsSectionProps {
  variant: ProductsSectionVariant;
  eyebrow: string;
  heading: string;
  subCopy: string;
  products: ProductsSectionProduct[];
}

export default null;
