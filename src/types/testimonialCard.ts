import type { AvatarLabelGroupProps } from '@/types/avatar';

export interface TestimonialCardProps {
  quote: string;
  platform?: 'twitter' | 'instagram' | 'facebook' | 'tiktok' | 'linkedin';
  author: AvatarLabelGroupProps;
  class?: string;
}
