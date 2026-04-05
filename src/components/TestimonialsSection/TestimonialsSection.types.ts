import type { AvatarLabelGroupProps } from '@/components/Avatar/Avatar.types';

export interface TestimonialsSectionTestimonial {
  quote: string;
  rating?: number;
  platform?: 'twitter' | 'instagram' | 'facebook' | 'tiktok' | 'linkedin';
  author: AvatarLabelGroupProps;
}

export interface TestimonialsSectionProps {
  heading: string;
  subCopy: string;
  testimonials: TestimonialsSectionTestimonial[];
}

export default null;
