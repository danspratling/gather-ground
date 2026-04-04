export type BadgeType = 'pill' | 'badge-modern';
export type BadgeSize = 'sm' | 'md' | 'lg';
export type BadgeColor =
  | 'gray'
  | 'brand'
  | 'error'
  | 'warning'
  | 'success'
  | 'blue-light'
  | 'blue'
  | 'indigo'
  | 'purple'
  | 'pink'
  | 'orange'
  | 'gray-blue';

export interface BadgeProps {
  label: string;
  type?: BadgeType;
  size?: BadgeSize;
  color?: BadgeColor;
  dot?: boolean;
  iconLeading?: boolean;
  iconTrailing?: boolean;
  class?: string;
}
