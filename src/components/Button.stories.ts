// @storybook-astro/framework does not export Meta/StoryObj — Astro stories are untyped by design.
// See: https://storybook-astro.org/writing-stories/
import { expect, within } from 'storybook/test';

// @ts-expect-error — .astro files have no TypeScript declarations
import Button from '@/components/Button.astro';

const meta = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    a11y: { disable: false },
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/zsTOcot4CKA5nq2ihg0ZLi/Gather-Ground-Website?node-id=3287-427074',
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'outline', 'ghost', 'link'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl'],
    },
    disabled: {
      control: 'boolean',
    },
    loading: {
      control: 'boolean',
    },
  },
};

export default meta;

export const Primary = {
  args: {
    label: 'Button CTA',
    variant: 'default' as const,
    size: 'md' as const,
    disabled: false,
    loading: false,
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button', { name: 'Button CTA' });

    await expect(button).toBeInTheDocument();
    await expect(button).not.toBeDisabled();

    await button.focus();
    await expect(button).toHaveFocus();
  },
};

export const Outline = {
  args: {
    label: 'Button CTA',
    variant: 'outline' as const,
    size: 'md' as const,
  },
};

export const Ghost = {
  args: {
    label: 'Button CTA',
    variant: 'ghost' as const,
    size: 'md' as const,
  },
};

export const Link = {
  args: {
    label: 'Button CTA',
    variant: 'link' as const,
    size: 'md' as const,
  },
};

export const SizeSm = {
  args: {
    label: 'Button CTA',
    variant: 'default' as const,
    size: 'sm' as const,
  },
};

export const SizeLg = {
  args: {
    label: 'Button CTA',
    variant: 'default' as const,
    size: 'lg' as const,
  },
};

export const Disabled = {
  args: {
    label: 'Button CTA',
    variant: 'default' as const,
    disabled: true,
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button', { name: 'Button CTA' });

    await expect(button).toBeDisabled();
  },
};

export const Loading = {
  args: {
    label: 'Button CTA',
    variant: 'default' as const,
    loading: true,
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button', { name: /Button CTA/ });

    await expect(button).toBeDisabled();
    await expect(button).toHaveAttribute('aria-busy', 'true');
  },
};

export const AsLink = {
  args: {
    label: 'Button CTA',
    href: '#',
    variant: 'default' as const,
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole('link', { name: 'Button CTA' })
    ).toBeInTheDocument();
  },
};
