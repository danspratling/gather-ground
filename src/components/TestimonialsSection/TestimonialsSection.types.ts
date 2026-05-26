import type { AvatarLabelGroupProps } from '@/components/Avatar/Avatar.types';

export interface TestimonialsSectionTestimonial {
  quote: string;
  rating?: number;
  platform?: 'twitter' | 'instagram' | 'facebook' | 'tiktok' | 'linkedin';
  author: AvatarLabelGroupProps;
}

export interface TestimonialsSectionCta {
  label: string;
  href: string;
}

export interface TestimonialsSectionProps {
  heading: string;
  subCopy: string;
  testimonials: TestimonialsSectionTestimonial[];
  ctaPrimary?: TestimonialsSectionCta;
  ctaSecondary?: TestimonialsSectionCta;
}

export default null;
