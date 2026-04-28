// @storybook-astro/framework does not export Meta/StoryObj — Astro stories are untyped by design.
// See: https://storybook-astro.org/writing-stories/
import SanityImage from './SanityImage.astro';

const meta = {
  title: 'Core/Sanity Image',
  component: SanityImage,
};

export default meta;

export const Default = {
  args: {
    asset: {
      asset: {
        _id: 'image-abc123-800x600-jpg',
      },
    },
    alt: 'A scenic view of the farm',
    width: 800,
    height: 450,
  },
};
