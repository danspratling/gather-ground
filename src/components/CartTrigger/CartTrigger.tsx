import { useEffect, useState } from 'react';
import { ShoppingCart01 } from '@untitledui-pro/icons/line';
import { cn } from '@/lib/utils';
import type { CartTriggerProps } from '@/components/CartTrigger/CartTrigger.types';

export default function CartTrigger({
  itemCount: initialItemCount = 0,
  class: className,
}: CartTriggerProps) {
  const [itemCount, setItemCount] = useState(initialItemCount);

  useEffect(() => {
    const handleCartUpdated = (e: Event) => {
      const event = e as CustomEvent<{ itemCount: number }>;
      if (typeof event.detail?.itemCount === 'number') {
        setItemCount(event.detail.itemCount);
      }
    };

    window.addEventListener('cart:updated', handleCartUpdated);
    return () => window.removeEventListener('cart:updated', handleCartUpdated);
  }, []);

  const handleClick = () => {
    window.dispatchEvent(new CustomEvent('cart:open', { bubbles: true }));
  };

  const ariaLabel =
    itemCount > 0
      ? `Open cart, ${itemCount} item${itemCount === 1 ? '' : 's'}`
      : 'Open cart';

  return (
    <button
      type="button"
      aria-label={ariaLabel}
      onClick={handleClick}
      className={cn(
        'relative inline-flex cursor-pointer items-center justify-center rounded p-2 text-brand-700 transition-colors hover:bg-brand-50',
        className
      )}
    >
      <ShoppingCart01 className="size-6" aria-hidden="true" />
      {itemCount > 0 && (
        <span
          aria-hidden="true"
          className="absolute right-0.5 top-0.5 flex min-w-[1.125rem] items-center justify-center rounded-full bg-terracotta-500 px-1 py-0.5 text-[10px] font-semibold leading-none text-off-white"
        >
          {itemCount > 99 ? '99+' : itemCount}
        </span>
      )}
    </button>
  );
}
