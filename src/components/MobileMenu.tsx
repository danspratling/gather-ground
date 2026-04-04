import { useState } from 'react';
import { Menu01, X, ChevronDown } from '@untitledui-pro/icons/line';
import { cn } from '@/lib/utils';
import type { HeaderNavLink, NavMenuItem } from '@/components/Header.types';

interface MobileMenuProps {
  logoSrc: string;
  logoAlt: string;
  navLinks: HeaderNavLink[];
  accountHref: string;
  basketHref: string;
  footerLinks: { label: string; href: string }[];
}

export default function MobileMenu({
  logoSrc,
  logoAlt,
  navLinks,
  accountHref,
  basketHref,
  footerLinks,
}: MobileMenuProps) {
  const [open, setOpen] = useState(false);
  const [openMenus, setOpenMenus] = useState<Set<string>>(new Set());

  const toggleMenu = (label: string) => {
    setOpenMenus((prev) => {
      const next = new Set(prev);
      if (next.has(label)) {
        next.delete(label);
      } else {
        next.add(label);
      }
      return next;
    });
  };

  const closeAll = () => {
    setOpen(false);
    setOpenMenus(new Set());
  };

  const half = Math.ceil(footerLinks.length / 2);
  const col1 = footerLinks.slice(0, half);
  const col2 = footerLinks.slice(half);

  return (
    <>
      <button
        type="button"
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        aria-controls="mobile-nav"
        onClick={() => setOpen((v) => !v)}
        className="rounded-lg p-2 text-gray-700 hover:bg-brand-25 focus-visible:ring-2 focus-visible:ring-brand-700 focus-visible:outline-none"
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
          className="fixed inset-0 z-50 flex flex-col bg-off-white"
        >
          {/* Panel header — logo + close */}
          <div className="flex h-20 shrink-0 items-center justify-between border-b border-gray-400 px-4">
            <a
              href="/"
              onClick={closeAll}
              aria-label={logoAlt}
              className="flex items-center gap-2"
            >
              <img src={logoSrc} alt={logoAlt} className="h-8 w-auto" />
            </a>
            <button
              type="button"
              aria-label="Close menu"
              onClick={closeAll}
              className="rounded-lg p-2 text-gray-700 hover:bg-brand-25 focus-visible:ring-2 focus-visible:ring-brand-700 focus-visible:outline-none"
            >
              <X className="size-6" aria-hidden="true" />
            </button>
          </div>

          {/* Scrollable body */}
          <nav
            aria-label="Mobile navigation"
            className="flex-1 overflow-y-auto"
          >
            {/* Nav accordion items */}
            <ul className="divide-y divide-gray-200 px-4">
              {navLinks.map((link) => (
                <li key={link.href ?? link.label}>
                  {link.menu ? (
                    <div>
                      <button
                        type="button"
                        aria-expanded={openMenus.has(link.label)}
                        onClick={() => toggleMenu(link.label)}
                        className="flex w-full items-center justify-between py-4 text-base font-semibold text-gray-900"
                      >
                        {link.label}
                        <ChevronDown
                          className={cn(
                            'size-4 shrink-0 text-gray-700 transition-transform duration-200',
                            openMenus.has(link.label) && 'rotate-180'
                          )}
                          aria-hidden="true"
                        />
                      </button>
                      {openMenus.has(link.label) && (
                        <ul className="pb-3">
                          {link.menu.map((item: NavMenuItem) => (
                            <li key={item.href}>
                              <a
                                href={item.href}
                                onClick={closeAll}
                                className={cn(
                                  'flex gap-2 rounded-lg px-3 py-2.5 hover:bg-brand-25',
                                  item.iconTrailing
                                    ? 'items-center justify-between'
                                    : 'flex-col'
                                )}
                              >
                                <span className="text-sm font-medium text-gray-900">
                                  {item.label}
                                </span>
                                {item.description && (
                                  <span className="text-xs text-gray-600">
                                    {item.description}
                                  </span>
                                )}
                              </a>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ) : (
                    <a
                      href={link.href}
                      onClick={closeAll}
                      className="block py-4 text-base font-semibold text-gray-900 hover:text-gray-700"
                    >
                      {link.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>

            {/* Footer links 2-col grid */}
            {footerLinks.length > 0 && (
              <div className="border-t border-gray-200 px-4 py-6">
                <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                  <ul className="flex flex-col gap-3">
                    {col1.map((link) => (
                      <li key={link.href}>
                        <a
                          href={link.href}
                          onClick={closeAll}
                          className="text-sm text-gray-600 hover:text-gray-900"
                        >
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                  <ul className="flex flex-col gap-3">
                    {col2.map((link) => (
                      <li key={link.href}>
                        <a
                          href={link.href}
                          onClick={closeAll}
                          className="text-sm text-gray-600 hover:text-gray-900"
                        >
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </nav>

          {/* Bottom CTAs */}
          <div className="shrink-0 border-t border-gray-200 px-4 py-4">
            <a
              href={basketHref}
              onClick={closeAll}
              className="block w-full rounded-full bg-brand-900 px-4 py-3 text-center text-sm font-semibold text-white hover:bg-brand-700"
            >
              Basket
            </a>
            <a
              href={accountHref}
              onClick={closeAll}
              className="mt-3 block w-full rounded-full border border-gray-400 px-4 py-3 text-center text-sm font-semibold text-gray-900 hover:bg-brand-25"
            >
              Account
            </a>
          </div>
        </div>
      )}
    </>
  );
}
