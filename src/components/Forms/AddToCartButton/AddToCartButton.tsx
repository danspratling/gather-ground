import { useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import QuantityStepper from '@/components/QuantityStepper/QuantityStepper';
import { useCart } from '@/lib/commerce/cart/useCart';
import type { AddToCartButtonProps } from './AddToCartButton.types';

export default function AddToCartButton({
  skuCode,
  inventoryStatus,
  class: className,
}: AddToCartButtonProps) {
  const { addToCart, isLoading: cartIsLoading } = useCart();
  const quantityRef = useRef(1);
  const [isAdding, setIsAdding] = useState(false);
  const isOOS = inventoryStatus === 'out_of_stock';
  const isDisabled = isOOS || isAdding || cartIsLoading;

  async function handleAddToCart() {
    if (isDisabled) return;
    setIsAdding(true);
    try {
      await addToCart(skuCode, quantityRef.current);
      // Open the CartDrawer after a successful add
      window.dispatchEvent(new CustomEvent('cart:open', { bubbles: true }));
    } catch {
      // Silently fail — cart store already logs the error
    } finally {
      setIsAdding(false);
    }
  }

  return (
    <div className={cn('flex flex-col items-start gap-4', className)}>
      <QuantityStepper
        value={1}
        min={1}
        disabled={isDisabled}
        onChange={(qty) => {
          quantityRef.current = qty;
        }}
      />

      <button
        type="button"
        disabled={isDisabled}
        onClick={handleAddToCart}
        className={cn(
          'w-full rounded-md border px-6 py-3 text-sm font-semibold transition-colors',
          isDisabled
            ? 'cursor-not-allowed border-brand-50 bg-brand-50 text-brand-300'
            : 'border-brand-600 bg-brand-700 text-brand-25 hover:bg-brand-600'
        )}
      >
        {isOOS ? 'Out of stock' : isAdding ? 'Adding…' : 'Add to cart'}
      </button>
    </div>
  );
}
