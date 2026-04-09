export interface DetailsIconsFeaturedImageFeature {
  icon: string;
  heading: string;
  body: string;
}

export interface DetailsIconsFeaturedImageProps {
  eyebrow: string;
  heading: string;
  body: string;
  features: DetailsIconsFeaturedImageFeature[];
  image: { src: string; alt: string };
  dark?: boolean;
}

export default null;
