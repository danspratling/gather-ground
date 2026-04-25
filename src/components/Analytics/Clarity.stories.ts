// @storybook-astro/framework does not export Meta/StoryObj — Astro stories are untyped by design.
// See: https://storybook-astro.org/writing-stories/
import Clarity from './Clarity.astro';

const meta = {
  title: 'Analytics/Clarity',
  component: Clarity,
  parameters: {
    design: { type: 'figma', url: '' },
  },
};

export default meta;

export const Default = {
  args: {
    projectId: 'example-project-id',
  },
};
