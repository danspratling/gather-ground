export interface CallToActionSimpleCenteredProps {
  variant: 'simple-centered';
  heading: string;
  body: string;
  primaryCta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
}

export interface CallToActionSimpleLeftProps {
  variant: 'simple-left';
  heading: string;
  body: string;
  primaryCta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
}

export interface CallToActionCardCenteredProps {
  variant: 'card-centered';
  heading: string;
  body: string;
  primaryCta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
}

export interface CallToActionCardLeftProps {
  variant: 'card-left';
  heading: string;
  body: string;
  primaryCta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
}

export interface CallToActionSplitImageProps {
  variant: 'split-image';
  heading: string;
  body: string;
  primaryCta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  image: { src: string; alt: string };
}

export type CallToActionProps =
  | CallToActionSimpleCenteredProps
  | CallToActionSimpleLeftProps
  | CallToActionCardCenteredProps
  | CallToActionCardLeftProps
  | CallToActionSplitImageProps;

export default null;
