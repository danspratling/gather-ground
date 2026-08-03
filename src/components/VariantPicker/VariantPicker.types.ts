import type { Option, Variant } from '@/lib/commerce/types';

export interface VariantPickerProps {
  options: Option[];
  variants: Variant[];
  selectedVariantId?: string;
  onVariantChange?: (variant: Variant) => void; // direct callback for same-tree React components
  class?: string;
}

export default null;
