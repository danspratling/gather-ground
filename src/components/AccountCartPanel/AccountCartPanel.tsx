import * as React from 'react';
import { cn } from '@/lib/utils';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import type { AccountCartPanelProps } from './AccountCartPanel.types';

export default function AccountCartPanel({
  customer,
  class: className,
}: AccountCartPanelProps) {
  const displayName =
    customer.firstName && customer.lastName
      ? `${customer.firstName} ${customer.lastName}`
      : customer.email;

  const initial = (customer.firstName || customer.email)
    .charAt(0)
    .toUpperCase();

  const [cartCount, setCartCount] = React.useState(0);

  React.useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<{ count?: number }>).detail;
      if (typeof detail?.count === 'number') {
        setCartCount(detail.count);
      }
    };
    window.addEventListener('cart:updated', handler);
    return () => window.removeEventListener('cart:updated', handler);
  }, []);

  const handleSignOut = async () => {
    await fetch('/api/commerce/auth/logout', { method: 'POST' });
    window.location.href = '/';
  };

  return (
    <Popover>
      <PopoverTrigger
        className={cn(
          'relative flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-semibold text-brand-800 hover:bg-brand-25 hover:text-brand-900',
          className
        )}
        aria-label={`Account menu for ${displayName}`}
      >
        <span
          className="flex size-7 items-center justify-center rounded-full bg-brand-100 text-xs font-semibold text-brand-700"
          aria-hidden="true"
        >
          {initial}
        </span>
        <span className="hidden lg:block">{displayName}</span>
        {cartCount > 0 && (
          <span
            className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-brand-900 text-[10px] font-semibold text-white"
            aria-label={`${cartCount} items in cart`}
          >
            {cartCount}
          </span>
        )}
      </PopoverTrigger>
      <PopoverContent
        className="w-48 p-1"
        align="end"
        side="bottom"
        sideOffset={8}
      >
        <nav aria-label="Account navigation">
          <ul className="flex flex-col gap-0.5">
            {[
              { label: 'My account', href: '/account' },
              { label: 'Orders', href: '/account/orders' },
              { label: 'Profile', href: '/account/profile' },
              { label: 'Addresses', href: '/account/addresses' },
            ].map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="block rounded-md px-3 py-2 text-sm font-medium text-brand-800 hover:bg-brand-25 hover:text-brand-900"
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li>
              <button
                type="button"
                onClick={handleSignOut}
                className="w-full rounded-md px-3 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700"
              >
                Sign out
              </button>
            </li>
          </ul>
        </nav>
      </PopoverContent>
    </Popover>
  );
}
