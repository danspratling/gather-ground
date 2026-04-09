export interface ContentFeature {
  heading: string;
  body: string;
}

export interface ContentIconFeature {
  icon: string;
  heading: string;
  body: string;
}

export interface ContentSimpleProps {
  variant: 'simple';
  icon: string;
  heading: string;
  body: string;
  features: ContentFeature[];
  dark?: boolean;
}

export interface ContentAlternatingProps {
  variant: 'alternating';
  icon: string;
  heading: string;
  body: string;
  checklistItems: string[];
  image: { src: string; alt: string };
  imagePosition?: 'left' | 'right';
  dark?: boolean;
}

export interface ContentIconsFeaturedImageProps {
  variant: 'icons-featured-image';
  eyebrow: string;
  heading: string;
  body: string;
  features: ContentIconFeature[];
  image: { src: string; alt: string };
  dark?: boolean;
}

export interface ContentTitleProps {
  variant: 'title';
  eyebrow: string;
  heading: string;
  body: string;
  align?: 'left' | 'center';
  dark?: boolean;
}

export type ContentProps =
  | ContentSimpleProps
  | ContentAlternatingProps
  | ContentIconsFeaturedImageProps
  | ContentTitleProps;

export default null;
