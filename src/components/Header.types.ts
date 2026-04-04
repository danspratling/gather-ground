import type { NavMenuItem } from '@/components/NavMenu.types';

export type { NavMenuItem };

export interface HeaderNavLink {
  label: string;
  href?: string;
  menu?: NavMenuItem[];
}

export interface HeaderProps {
  logoSrc: string;
  logoAlt: string;
  navLinks: HeaderNavLink[];
  actions?: 'icons' | 'buttons';
  accountHref?: string;
  basketHref?: string;
  ctaLabel?: string;
  ctaHref?: string;
  loginLabel?: string;
  loginHref?: string;
  footerLinks?: { label: string; href: string }[];
}

export default null;
