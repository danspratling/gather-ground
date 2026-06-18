import type { NavMenuItem } from '@/components/Layout/Header/NavMenu.types';

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
  showCommerceSlots?: boolean;
  ctaLabel?: string;
  ctaHref?: string;
  footerLinks?: { label: string; href: string }[];
}

export default null;
