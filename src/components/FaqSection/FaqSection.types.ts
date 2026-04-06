import type { AccordionItem } from '@/components/Accordion/Accordion.types';
import type { CallToActionProps } from '@/components/CallToAction/CallToAction.types';

export interface FaqSectionProps {
  heading: string;
  subCopy: string;
  items: AccordionItem[];
  cta?: CallToActionProps;
}

export default null;
