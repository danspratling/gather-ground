export interface ProductsSectionAProduct {
  image: string;
  imageAlt: string;
  title: string;
  description?: string;
  href: string;
}

export interface ProductsSectionAProps {
  eyebrow: string;
  heading: string;
  subCopy: string;
  products: ProductsSectionAProduct[];
}

export default null;
