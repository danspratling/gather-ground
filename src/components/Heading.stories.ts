import { expect, within } from 'storybook/test';

// @ts-expect-error — .astro files have no TypeScript declarations
import Heading from '@/components/Heading.astro';

const meta = {
  title: 'Components/Typography/Heading',
  component: Heading,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    a11y: { disable: false },
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/zsTOcot4CKA5nq2ihg0ZLi/Gather-Ground-Website?node-id=1647-376184',
    },
  },
  argTypes: {
    as: {
      control: 'select',
      options: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
    },
    size: {
      control: 'select',
      options: ['display-xl', 'display-md', 'text-xl', 'text-lg'],
    },
    weight: {
      control: 'select',
      options: ['medium', 'semibold'],
    },
  },
};

export default meta;

export const DisplayXL = {
  args: {
    as: 'h1' as const,
    size: 'display-xl' as const,
    weight: 'medium' as const,
    text: 'Gather Ground',
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement);
    const heading = canvas.getByRole('heading', {
      level: 1,
      name: 'Gather Ground',
    });
    await expect(heading).toBeInTheDocument();
    await expect(heading).toHaveClass('text-display-xl');
  },
};

export const DisplayMD = {
  args: {
    as: 'h2' as const,
    size: 'display-md' as const,
    weight: 'semibold' as const,
    text: 'Section Heading',
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement);
    const heading = canvas.getByRole('heading', {
      level: 2,
      name: 'Section Heading',
    });
    await expect(heading).toBeInTheDocument();
    await expect(heading).toHaveClass('text-display-md');
  },
};

export const TextXL = {
  args: {
    as: 'h3' as const,
    size: 'text-xl' as const,
    weight: 'semibold' as const,
    text: 'Sub-heading XL',
  },
};

export const TextLG = {
  args: {
    as: 'h4' as const,
    size: 'text-lg' as const,
    weight: 'semibold' as const,
    text: 'Sub-heading LG',
  },
};

export const WithColor = {
  args: {
    as: 'h2' as const,
    size: 'display-md' as const,
    weight: 'semibold' as const,
    color: '#a5a5a5',
    text: 'Muted heading',
  },
};
