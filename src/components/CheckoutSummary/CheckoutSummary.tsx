import type { LineItem } from '@/lib/commerce/types';
import type { CheckoutSummaryProps } from '@/components/CheckoutSummary/CheckoutSummary.types';

function ItemList({ items }: { items: LineItem[] }) {
  if (items.length === 0) {
    return <p className="py-4 text-sm text-brand-500">Your cart is empty.</p>;
  }

  return (
    <div className="divide-y divide-brand-200">
      {items.map((item) => {
        const variantLabel = Object.entries(item.selectedOptions)
          .map(([key, val]) => `${key}: ${val}`)
          .join(', ');

        return (
          <div key={item.id} className="flex items-start gap-3 py-3 text-sm">
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium text-brand-700">
                {item.variantId}
              </p>
              {variantLabel && <p className="text-brand-500">{variantLabel}</p>}
              <p className="text-brand-500">Qty: {item.quantity}</p>
            </div>
            <p className="shrink-0 font-semibold text-brand-700">
              {item.subtotal.formatted}
            </p>
          </div>
        );
      })}
    </div>
  );
}

function Totals({ subtotal, total }: { subtotal: string; total: string }) {
  return (
    <div className="mt-4 space-y-2 border-t border-brand-200 pt-4">
      <div className="flex justify-between text-sm text-brand-600">
        <span>Subtotal</span>
        <span>{subtotal}</span>
      </div>
      <div className="flex justify-between text-base font-semibold text-brand-700">
        <span>Total</span>
        <span>{total}</span>
      </div>
    </div>
  );
}

export function CheckoutSummary({ cart }: CheckoutSummaryProps) {
  return (
    <div className="rounded-xl border border-brand-200 bg-brand-50 p-6">
      {/*
       * <details> provides native mobile collapsible behaviour.
       * class="group" enables the Tailwind group-open: variant.
       * On desktop the <summary> is hidden so the toggle is inaccessible,
       * and md:block forces the content div visible regardless of open state.
       */}
      <details className="group">
        {/* Mobile toggle — hidden on desktop */}
        <summary className="flex cursor-pointer list-none items-center justify-between py-1 md:hidden">
          <span className="text-sm font-semibold text-brand-700">
            Order summary
          </span>
          <span className="text-sm font-semibold text-brand-700">
            {cart.total}
          </span>
        </summary>

        {/* Desktop heading — hidden on mobile, always visible on desktop */}
        <p className="mb-4 hidden text-base font-semibold text-brand-700 md:block">
          Order summary
        </p>

        {/* Content — hidden by default (mobile closed), visible when open (mobile) or on desktop */}
        <div className="hidden group-open:block md:block">
          <ItemList items={cart.items} />
          <Totals subtotal={cart.subtotal} total={cart.total} />
        </div>
      </details>
    </div>
  );
}

export default null;
