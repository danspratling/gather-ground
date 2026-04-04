// @storybook-astro/framework does not export Meta/StoryObj — Astro stories are untyped by design.
// See: https://storybook-astro.org/writing-stories/
import { expect, within } from 'storybook/test';

// @ts-expect-error — .astro files have no TypeScript declarations
import SectionDivider from '@/components/SectionDivider.astro';

const meta = {
  title: 'Components/SectionDivider',
  component: SectionDivider,
  parameters: {
    layout: 'fullscreen',
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/zsTOcot4CKA5nq2ihg0ZLi/Gather-Ground-Website?node-id=6586-193458',
    },
  },
};

export default meta;

export const Default = {
  args: { spacing: 'md' as const },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('separator')).toBeInTheDocument();
  },
};

export const SpacingSm = {
  args: { spacing: 'sm' as const },
};

export const SpacingLg = {
  args: { spacing: 'lg' as const },
};
