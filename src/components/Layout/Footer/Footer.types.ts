export type SocialPlatform =
  | 'instagram'
  | 'facebook'
  | 'tiktok'
  | 'twitter'
  | 'linkedin';

export interface SocialLink {
  platform: SocialPlatform;
  href: string;
  label: string;
}

export interface FooterLink {
  label: string;
  href: string;
  badge?: string;
}

export interface FooterLinkGroup {
  heading: string;
  links: FooterLink[];
}

export interface LegalLink {
  label: string;
  href: string;
}

export interface FooterProps {
  logoSrc: string;
  logoAlt: string;
  description: string;
  socialLinks: SocialLink[];
  linkGroups: FooterLinkGroup[];
  newsletterHeading: string;
  copyrightText: string;
  legalLinks: LegalLink[];
}

export default null;
