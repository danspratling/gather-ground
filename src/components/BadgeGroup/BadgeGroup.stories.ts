import BadgeGroup from './BadgeGroup.astro';
import type { BadgeGroupProps } from './BadgeGroup.types';

export default {
  title: 'Core/BadgeGroup',
  component: BadgeGroup,
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/zsTOcot4CKA5nq2ihg0ZLi/Gather-Ground-Website?node-id=1046-8088',
    },
  },
} satisfies Record<string, unknown>;

const baseArgs: BadgeGroupProps = {
  badgeLabel: 'New feature',
  text: "We've just released a new feature",
};

export const LeadingGray = {
  args: {
    ...baseArgs,
    color: 'gray',
    badgePosition: 'leading',
  } satisfies BadgeGroupProps,
};

export const LeadingGrayAsLink = {
  args: {
    ...baseArgs,
    color: 'gray',
    badgePosition: 'leading',
    href: '/blog',
  } satisfies BadgeGroupProps,
};

export const LeadingBrand = {
  args: {
    ...baseArgs,
    color: 'brand',
    badgePosition: 'leading',
  } satisfies BadgeGroupProps,
};

export const LeadingBrandAsLink = {
  args: {
    ...baseArgs,
    color: 'brand',
    badgePosition: 'leading',
    href: '/blog',
  } satisfies BadgeGroupProps,
};

export const TrailingGray = {
  args: {
    ...baseArgs,
    badgeLabel: 'Version 4.0',
    color: 'gray',
    badgePosition: 'trailing',
  } satisfies BadgeGroupProps,
};

export const TrailingGrayAsLink = {
  args: {
    ...baseArgs,
    badgeLabel: 'Version 4.0',
    color: 'gray',
    badgePosition: 'trailing',
    href: '/blog',
  } satisfies BadgeGroupProps,
};

export const TrailingBrand = {
  args: {
    ...baseArgs,
    badgeLabel: 'Version 4.0',
    color: 'brand',
    badgePosition: 'trailing',
  } satisfies BadgeGroupProps,
};

export const TrailingBrandAsLink = {
  args: {
    ...baseArgs,
    badgeLabel: 'Version 4.0',
    color: 'brand',
    badgePosition: 'trailing',
    href: '/blog',
  } satisfies BadgeGroupProps,
};
