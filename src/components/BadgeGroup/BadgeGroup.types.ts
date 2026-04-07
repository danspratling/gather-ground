import type {
  BadgeColor,
  BadgeSize,
  BadgeType,
} from '@/components/Badge/Badge.types';

export interface BadgeGroupProps {
  badges: string[];
  color?: BadgeColor;
  size?: BadgeSize;
  type?: BadgeType;
  class?: string;
}

export default null;
