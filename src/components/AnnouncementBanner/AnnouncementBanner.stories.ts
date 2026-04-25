// @storybook-astro/framework does not export Meta/StoryObj — Astro stories are untyped by design.
// See: https://storybook-astro.org/writing-stories/
import AnnouncementBanner from './AnnouncementBanner.astro';

const meta = {
  title: 'Components/AnnouncementBanner',
  component: AnnouncementBanner,
  parameters: {
    design: { type: 'figma', url: '' },
  },
};

export default meta;

export const Info = {
  args: {
    message: 'Free delivery on orders over $100 this week!',
    ctaLabel: 'Shop now',
    ctaHref: '/shop',
    variant: 'info',
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
