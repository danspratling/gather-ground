import { cn } from '@/lib/utils';
import type { CartItemRowProps } from '@/components/CartItemRow/CartItemRow.types';
import QuantityStepper from '@/components/QuantityStepper/QuantityStepper';
import RemoveItemButton from '@/components/RemoveItemButton/RemoveItemButton';

export default function CartItemRow({
  item,
  onQuantityChange,
  onRemove,
  isUpdating = false,
  class: className,
}: CartItemRowProps) {
  const variantLabel = Object.entries(item.selectedOptions)
    .map(([key, val]) => `${key}: ${val}`)
    .join(', ');

  return (
    <div
      className={cn(
        'flex items-start gap-4 py-4',
        isUpdating && 'opacity-60',
        className
      )}
    >
      {/* Product image placeholder */}
      <div className="size-16 shrink-0 overflow-hidden rounded-lg bg-brand-50 sm:size-20">
        <div className="flex size-full items-center justify-center text-brand-300 text-xs">
          IMG
        </div>
      </div>

      {/* Item details */}
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <p className="truncate text-sm font-semibold text-brand-700">
          {item.variantId}
        </p>
        {variantLabel && (
          <p className="text-xs text-brand-500">{variantLabel}</p>
        )}
        <p className="text-sm text-brand-600">{item.price.formatted}</p>

        <div className="mt-2 flex items-center gap-3">
          <QuantityStepper
            value={item.quantity}
            min={1}
            max={99}
            disabled={isUpdating}
            onChange={(qty) => onQuantityChange(item.id, qty)}
          />
          <RemoveItemButton
            isLoading={isUpdating}
            onRemove={() => onRemove(item.id)}
          />
        </div>
      </div>

      {/* Line total */}
      <p className="shrink-0 text-sm font-semibold text-brand-700">
        {item.subtotal.formatted}
      </p>
    </div>
  );
}
