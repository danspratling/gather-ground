import { useEffect, useState } from 'react';
import { X } from '@untitledui-pro/icons/line';
import { cn } from '@/lib/utils';
import CartItemRow from '@/components/CartItemRow/CartItemRow';
import { useCart } from '@/lib/commerce/cart/useCart';
import type { LineItem } from '@/lib/commerce/types';
import type { CartDrawerProps } from '@/components/CartDrawer/CartDrawer.types';

/** Inline empty-cart state — CartEmptyState.astro cannot be imported in React */
function EmptyCart() {
  return (
    <div className="flex flex-col items-center justify-center gap-6 px-6 py-16 text-center">
      <span className="flex size-16 items-center justify-center rounded-full bg-brand-50 text-brand-400">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18M16 10a4 4 0 0 1-8 0" />
        </svg>
      </span>
      <div className="flex flex-col gap-2">
        <p className="text-xl font-semibold text-brand-700">
          Your cart is empty
        </p>
        <p className="max-w-xs text-sm text-brand-500">
          Looks like you haven&apos;t added anything yet.
        </p>
      </div>
      <a
        href="/products"
        className="text-sm font-medium text-terracotta-500 underline underline-offset-2 hover:text-terracotta-600"
      >
        Continue shopping
      </a>
    </div>
  );
}

export default function CartDrawer({
  class: className,
  _items,
  _isLoading,
  _isOpen,
}: CartDrawerProps) {
  const {
    items: storeItems,
    subtotal,
    isLoading: storeIsLoading,
    updateCartItem,
    removeCartItem,
  } = useCart();

  // Allow test/story overrides via underscore props
  const items: LineItem[] = _items ?? storeItems;
  const isLoading = _isLoading ?? storeIsLoading;

  // Always derive subtotal from the items we're actually displaying so _items
  // overrides (stories) and live store items both show the correct total.
  const displaySubtotal =
    items.length > 0
      ? new Intl.NumberFormat('en-GB', {
          style: 'currency',
          currency: items[0].subtotal.currency || 'GBP',
        }).format(
          items.reduce(
            (sum: number, item: LineItem) => sum + item.subtotal.amount,
            0
          ) / 100
        )
      : subtotal;

  const [isOpen, setIsOpen] = useState(_isOpen ?? false);

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('cart:open', handleOpen);
    return () => window.removeEventListener('cart:open', handleOpen);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          aria-hidden="true"
          className="fixed inset-0 z-40 bg-brand-700/40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Drawer panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        className={cn(
          'fixed right-0 top-0 z-50 flex h-full w-full max-w-sm flex-col bg-off-white shadow-xl transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-x-0' : 'translate-x-full',
          className
        )}
      >
        {/* Header */}
        <header className="flex items-center justify-between border-b border-gray-200 px-4 py-4">
          <h2 className="text-lg font-semibold text-brand-700">Cart</h2>
          <button
            type="button"
            aria-label="Close cart"
            onClick={() => setIsOpen(false)}
            className="rounded p-1.5 text-brand-500 transition-colors hover:bg-brand-50 hover:text-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-700 focus-visible:ring-offset-1"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </header>

        {/* Scrollable item list */}
        <div className="flex-1 overflow-y-auto px-4">
          {items.length === 0 ? (
            <EmptyCart />
          ) : (
            <ul className="divide-y divide-gray-200">
              {items.map((item) => (
                <li key={item.id}>
                  <CartItemRow
                    item={item}
                    isUpdating={isLoading}
                    onQuantityChange={(lineItemId, qty) =>
                      handleQuantityChange(lineItemId, qty)
                    }
                    onRemove={(lineItemId) => handleRemove(lineItemId)}
                  />
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer — only shown when cart has items */}
        {items.length > 0 && (
          <footer className="border-t border-gray-200 px-4 py-4">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-brand-600">Subtotal</p>
              <p className="text-sm font-semibold text-brand-700">
                {displaySubtotal}
              </p>
            </div>
            <a
              href="/checkout"
              className="block w-full rounded-lg bg-brand-700 px-4 py-3 text-center text-sm font-semibold text-off-white transition-colors hover:bg-brand-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-700 focus-visible:ring-offset-2"
            >
              Checkout
            </a>
            <a
              href="/products"
              className="mt-3 block w-full rounded-lg border border-brand-50 bg-transparent px-4 py-3 text-center text-sm font-semibold text-brand-700 transition-colors hover:bg-brand-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-700 focus-visible:ring-offset-2"
            >
              Continue shopping
            </a>
          </footer>
        )}
      </div>
    </>
  );
}
