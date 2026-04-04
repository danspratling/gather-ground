import type { ButtonProps } from '@/components/Button.types';
import type { AvatarGroupProps } from '@/components/Avatar/Avatar.types';

export interface CallToActionProps {
  heading: string;
  body: string;
  primaryButton: ButtonProps;
  secondaryButton?: ButtonProps;
  avatarGroup?: AvatarGroupProps;
  class?: string;
}

export default null;
