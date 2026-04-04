export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export interface AvatarProps {
  src: string;
  alt: string;
  size?: AvatarSize;
  class?: string;
}

export interface AvatarLabelGroupProps {
  src: string;
  alt: string;
  name: string;
  secondary?: string;
  secondaryIsHandle?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  class?: string;
}

export interface AvatarGroupProps {
  avatars: { src: string; alt: string }[];
  size?: 'xl';
  class?: string;
}

export default null;
