import type { AvatarLabelGroupProps } from '@/components/Avatar/Avatar.types';

export interface TestimonialCardProps {
  quote: string;
  platform?: 'twitter' | 'instagram' | 'facebook' | 'tiktok' | 'linkedin';
  author: AvatarLabelGroupProps;
  class?: string;
}

export default null;
