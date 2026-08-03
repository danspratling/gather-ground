import { useState } from 'react';
import { cn } from '@/lib/utils';
import QuantityStepper from '@/components/QuantityStepper/QuantityStepper';
import type { AddToCartButtonProps } from '@/components/Forms/AddToCartButton/AddToCartButton.types';

export default function AddToCartButton({
  variantId,
  inventoryStatus,
  onAddToCart,
  class: className,
}: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1);
  const isOOS = inventoryStatus === 'out_of_stock';

  function handleAddToCart() {
    if (isOOS) return;
    onAddToCart?.(variantId, quantity);
  }

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      <QuantityStepper
        value={quantity}
        min={1}
        disabled={isOOS}
        onChange={setQuantity}
      />

      <button
        type="button"
        disabled={isOOS}
        onClick={handleAddToCart}
        className={cn(
          'w-full rounded-md border px-6 py-3 text-sm font-semibold transition-colors',
          isOOS
            ? 'cursor-not-allowed border-brand-50 bg-brand-50 text-brand-300'
            : 'border-brand-600 bg-brand-700 text-brand-25 hover:bg-brand-600'
        )}
      >
        {isOOS ? 'Out of stock' : 'Add to cart'}
      </button>
    </div>
  );
}
