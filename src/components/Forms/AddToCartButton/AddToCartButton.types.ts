export interface AddToCartButtonProps {
  variantId: string;
  inventoryStatus: 'in_stock' | 'low_stock' | 'out_of_stock';
  onAddToCart?: (variantId: string, quantity: number) => void;
  class?: string;
}

export default null;
