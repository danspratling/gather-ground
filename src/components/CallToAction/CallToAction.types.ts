export interface CallToActionSimpleCenteredProps {
  variant: 'simple-centered';
  heading: string;
  body: string;
  primaryCta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
}

export type CallToActionProps = CallToActionSimpleCenteredProps;

export default null;
