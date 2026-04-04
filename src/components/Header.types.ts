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
  ctaLabel?: string;
  ctaHref?: string;
}

export default null;
