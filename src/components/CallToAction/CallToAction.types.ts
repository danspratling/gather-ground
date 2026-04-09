import type { ButtonProps } from '@/components/Forms/Button/Button.types';
import type { AvatarGroupProps } from '@/components/Avatar/Avatar.types';

export interface CallToActionSimpleCenteredProps {
  variant: 'simple-centered';
  heading: string;
  body: string;
  primaryCta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
}

export type CallToActionProps = CallToActionSimpleCenteredProps;

export default null;
