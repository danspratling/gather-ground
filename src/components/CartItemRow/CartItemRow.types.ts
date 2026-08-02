import type { LineItem } from '@/lib/commerce/types';

export interface CartItemRowProps {
  item: LineItem;
  onQuantityChange: (lineItemId: string, quantity: number) => void;
  onRemove: (lineItemId: string) => void;
  isUpdating?: boolean;
  class?: string;
}

export default null;
