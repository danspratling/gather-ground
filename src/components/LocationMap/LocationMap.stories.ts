// @storybook-astro/framework does not export Meta/StoryObj — Astro stories are untyped by design.
// See: https://storybook-astro.org/writing-stories/
import LocationMap from './LocationMap.astro';

const meta = {
  title: 'Sections/Location Map',
  component: LocationMap,
  parameters: {
    design: { type: 'figma', url: '' },
  },
};

export default meta;

export const Default = {
  args: {
    embedUrl:
      'https://www.openstreetmap.org/export/embed.html?bbox=-93.0%2C42.0%2C-92.5%2C42.5&layer=mapnik',
    title: 'Gather Ground Farm',
    height: 400,
  },
};
