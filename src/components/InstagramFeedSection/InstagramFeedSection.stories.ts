// @storybook-astro/framework does not export Meta/StoryObj — Astro stories are untyped by design.
// See: https://storybook-astro.org/writing-stories/
import { expect, within } from 'storybook/test';

import InstagramFeedSection from '@/components/InstagramFeedSection/InstagramFeedSection.astro';

const meta = {
  title: 'Sections/Instagram Feed Section',
  component: InstagramFeedSection,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    a11y: { disable: false },
    chromatic: { viewports: [375, 1440] },
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/zsTOcot4CKA5nq2ihg0ZLi/Gather-Ground-Website',
    },
  },
};

export default meta;

export const Default = {
  args: {
    eyebrow: 'Instagram',
    heading: 'Follow along on Instagram',
    subCopy:
      "The latest from the farm — what we're growing, raising, and making.",
    viewAllLabel: 'Follow on Instagram',
    handle: 'gathergroundfarm',
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement);

    await expect(
      canvas.getByRole('heading', { name: 'Follow along on Instagram' })
    ).toBeInTheDocument();

    const followLink = canvas.getByRole('link', {
      name: /Follow on Instagram/,
    });
    await expect(followLink).toBeInTheDocument();
    await expect(followLink).toHaveAttribute('target', '_blank');
    await expect(followLink).toHaveAttribute('rel', 'noopener noreferrer');
  },
};

export const WithoutHandle = {
  args: {
    eyebrow: 'Instagram',
    heading: 'Follow along on Instagram',
    subCopy: 'When the handle is not set, the Follow button is hidden.',
  },
};

export const WithoutFeed = {
  args: {
    eyebrow: 'Instagram',
    heading: 'Follow along on Instagram',
    subCopy:
      'When no Behold feed id is configured, only the section header renders.',
    handle: 'gathergroundfarm',
  },
};

// Loads the live Behold widget — kept as a manual story only so that
// Chromatic snapshots are not affected by third-party content changes.
export const WithFeed = {
  args: {
    eyebrow: 'Instagram',
    heading: 'Follow along on Instagram',
    subCopy:
      "The latest from the farm — what we're growing, raising, and making.",
    viewAllLabel: 'Follow on Instagram',
    handle: 'gathergroundfarm',
    feedId: 'SZ2qZFKvuM9vIPXnQEq9',
  },
  parameters: {
    chromatic: { disableSnapshot: true },
  },
};
