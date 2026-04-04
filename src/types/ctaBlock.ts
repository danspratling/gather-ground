import type { ButtonProps } from '@/types/button';
import type { AvatarGroupProps } from '@/types/avatar';

export interface CtaBlockProps {
  heading: string;
  body: string;
  primaryButton: ButtonProps;
  secondaryButton?: ButtonProps;
  avatarGroup?: AvatarGroupProps;
  class?: string;
}
