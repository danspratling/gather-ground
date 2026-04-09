export interface CtaCardProps {
  heading: string;
  body: string;
  primaryCta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  layout?: 'horizontal' | 'vertical';
}

export default null;
