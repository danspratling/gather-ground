// @ts-expect-error — .astro files have no TypeScript declarations
import BadgeGroup from './BadgeGroup.astro';
import type { BadgeGroupProps } from './BadgeGroup.types';

export default {
  title: 'Components/BadgeGroup',
  component: BadgeGroup,
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/zsTOcot4CKA5nq2ihg0ZLi/Gather-Ground-Website?node-id=1046-8088',
    },
  },
} satisfies Record<string, unknown>;

export const Default = {
  args: {
    badges: ['New feature', 'Design'],
  } satisfies BadgeGroupProps,
};

export const SingleBadge = {
  args: {
    badges: ['Product'],
  } satisfies BadgeGroupProps,
};

export const ManyBadges = {
  args: {
    badges: ['Product', 'Research', 'Frameworks'],
  } satisfies BadgeGroupProps,
};
