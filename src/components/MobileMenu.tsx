import { useState } from 'react';
import { Menu01, X } from '@untitledui-pro/icons/line';
import { cn } from '@/lib/utils';
import type { HeaderNavLink, NavMenuItem } from '@/components/Header.types';

interface MobileMenuProps {
  navLinks: HeaderNavLink[];
  ctaLabel: string;
  ctaHref: string;
}

export default function MobileMenu({
  navLinks,
  ctaLabel,
  ctaHref,
}: MobileMenuProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        aria-controls="mobile-nav"
        onClick={() => setOpen((v) => !v)}
        className="rounded-lg p-2 text-brand-700 hover:bg-brand-25 focus-visible:ring-2 focus-visible:ring-brand-700 focus-visible:outline-none"
      >
        {open ? (
          <X className="size-6" aria-hidden="true" />
        ) : (
          <Menu01 className="size-6" aria-hidden="true" />
        )}
      </button>

      {open && (
        <div
          id="mobile-nav"
          className="fixed inset-x-0 top-[57px] z-40 border-b border-gray-100 bg-off-white px-4 pb-6 pt-4 shadow-lg"
        >
          <nav aria-label="Mobile navigation">
            <ul className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <li key={link.href ?? link.label}>
                  {link.menu ? (
                    <div className="flex flex-col gap-1">
                      <span className="px-2 py-1.5 text-xs font-semibold uppercase tracking-wider text-brand-400">
                        {link.label}
                      </span>
                      <ul className="flex flex-col gap-0.5 pl-2">
                        {link.menu.map((item: NavMenuItem) => (
                          <li key={item.href}>
                            <a
                              href={item.href}
                              onClick={() => setOpen(false)}
                              className="flex flex-col gap-0.5 rounded-lg px-3 py-2 hover:bg-brand-25"
                            >
                              <span className="text-sm font-medium text-brand-900">
                                {item.label}
                              </span>
                              {item.description && (
                                <span className="text-xs text-brand-400">
                                  {item.description}
                                </span>
                              )}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <a
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="block rounded-lg px-3 py-2 text-sm font-medium text-brand-700 hover:bg-brand-25 hover:text-brand-900"
                    >
                      {link.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>

            <div className="mt-4 border-t border-gray-100 pt-4">
              <a
                href={ctaHref}
                className={cn(
                  'block w-full rounded-lg bg-brand-800 px-4 py-2.5 text-center text-sm font-semibold text-white',
                  'hover:bg-brand-900'
                )}
              >
                {ctaLabel}
              </a>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
