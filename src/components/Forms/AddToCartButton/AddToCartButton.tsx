import { useState } from 'react';
import { cn } from '@/lib/utils';
import type { AddToCartButtonProps } from '@/components/Forms/AddToCartButton/AddToCartButton.types';

export default function AddToCartButton({
  variantId,
  inventoryStatus,
  onAddToCart,
  class: className,
}: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1);
  const isOOS = inventoryStatus === 'out_of_stock';

  function decrement() {
    setQuantity((q) => Math.max(1, q - 1));
  }

  function increment() {
    setQuantity((q) => q + 1);
  }

  function handleAddToCart() {
    if (isOOS) return;
    onAddToCart?.(variantId, quantity);
  }

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      <div className="flex items-center gap-3">
        <div className="flex items-center rounded-md border border-secondary-400 bg-secondary-50">
          <button
            type="button"
            aria-label="Decrease quantity"
            disabled={isOOS || quantity <= 1}
            onClick={decrement}
            className="flex h-10 w-10 items-center justify-center rounded-l-md text-brand-700 transition-colors hover:bg-secondary-100 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <span
              aria-hidden="true"
              className="text-lg font-medium leading-none"
            >
              −
            </span>
          </button>
          <input
            type="number"
            min={1}
            value={quantity}
            readOnly
            aria-label="Quantity"
            disabled={isOOS}
            className="h-10 w-12 border-x border-secondary-400 bg-transparent text-center text-sm font-medium text-gray-900 disabled:opacity-40"
          />
          <button
            type="button"
            aria-label="Increase quantity"
            disabled={isOOS}
            onClick={increment}
            className="flex h-10 w-10 items-center justify-center rounded-r-md text-brand-700 transition-colors hover:bg-secondary-100 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <span
              aria-hidden="true"
              className="text-lg font-medium leading-none"
            >
              +
            </span>
          </button>
        </div>
      </div>

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
