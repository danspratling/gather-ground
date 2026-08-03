import { User01 } from '@untitledui-pro/icons/line';
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

  const handleSignOut = async () => {
    await fetch('/api/commerce/auth/logout', { method: 'POST' });
    window.location.href = '/';
  };

  return (
    <Popover>
      <PopoverTrigger
        className={cn(
          'relative inline-flex cursor-pointer items-center justify-center rounded p-2 text-brand-700 transition-colors hover:bg-brand-50',
          className
        )}
        aria-label={`Account menu for ${displayName}`}
      >
        <User01 className="size-6" aria-hidden="true" />
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
