import type { Option, Variant } from '@/lib/commerce/types';

export interface VariantPickerProps {
  options: Option[];
  variants: Variant[];
  selectedVariantId?: string;
  class?: string;
}

export default null;
