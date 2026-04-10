import type { AccordionItem } from '@/components/Accordion/Accordion.types';
import type { ButtonProps } from '@/components/Forms/Button/Button.types';
import type { AvatarGroupProps } from '@/components/Avatar/Avatar.types';

export interface FaqCtaProps {
  heading: string;
  body: string;
  primaryButton: ButtonProps;
  secondaryButton?: ButtonProps;
  avatarGroup?: AvatarGroupProps;
}

export interface FaqSectionProps {
  heading: string;
  subCopy: string;
  items: AccordionItem[];
  cta?: FaqCtaProps;
}

export default null;
