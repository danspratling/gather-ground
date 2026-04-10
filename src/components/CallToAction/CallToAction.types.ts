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

export type CallToActionProps =
  | CallToActionSimpleCenteredProps
  | CallToActionSimpleLeftProps;

export default null;
