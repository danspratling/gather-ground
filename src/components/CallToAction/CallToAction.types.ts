import type { ButtonProps } from '@/components/Forms/Button/Button.types';
import type { AvatarGroupProps } from '@/components/Avatar/Avatar.types';

export interface CallToActionProps {
  heading: string;
  body: string;
  primaryButton: ButtonProps;
  secondaryButton?: ButtonProps;
  avatarGroup?: AvatarGroupProps;
  centered?: boolean;
  class?: string;
}

export default null;
