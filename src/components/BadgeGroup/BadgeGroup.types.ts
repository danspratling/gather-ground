export type BadgeGroupColor = 'gray' | 'brand';
export type BadgeGroupBadgePosition = 'leading' | 'trailing';

export interface BadgeGroupProps {
  /** Text shown inside the inner badge pill (e.g. "New feature", "Version 4.0") */
  badgeLabel: string;
  /** Announcement / descriptor text shown alongside the inner badge */
  text: string;
  /** Whether the inner badge appears before or after the text. Default: 'leading' */
  badgePosition?: BadgeGroupBadgePosition;
  /** Colour variant. 'gray' uses the secondary (warm cream) palette; 'brand' uses the neutral palette. Default: 'gray' */
  color?: BadgeGroupColor;
  /** When provided, renders as an <a> and adds an arrow icon */
  href?: string;
  class?: string;
}

export default null;
