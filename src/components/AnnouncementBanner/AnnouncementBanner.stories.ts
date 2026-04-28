// @storybook-astro/framework does not export Meta/StoryObj — Astro stories are untyped by design.
// See: https://storybook-astro.org/writing-stories/
import { expect, within } from 'storybook/test';
import AnnouncementBanner from './AnnouncementBanner.astro';

const meta = {
  title: 'Layout/Announcement Banner',
  component: AnnouncementBanner,
};

export default meta;

export const Info = {
  args: {
    message: 'Free delivery on orders over $100 this week!',
    ctaLabel: 'Shop now',
    ctaHref: '/shop',
    variant: 'info',
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('Free delivery on orders over $100 this week!')).toBeInTheDocument();
    await expect(canvas.getByRole('button', { name: 'Dismiss announcement' })).toBeInTheDocument();
  },
};

export const Warning = {
  args: {
    message: 'Limited stock on heritage pork cuts.',
    variant: 'warning',
  },
};

export const Success = {
  args: {
    message: 'We now ship to all 50 states!',
    variant: 'success',
  },
};
