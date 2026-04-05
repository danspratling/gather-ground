import { expect, within } from 'storybook/test';

// @ts-expect-error — .astro files have no TypeScript declarations
import Body from '@/components/Typography/Body/Body.astro';

const meta = {
  title: 'Core/Typography/Body',
  component: Body,
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
      options: ['p', 'span', 'div'],
    },
    size: {
      control: 'select',
      options: ['xl', 'lg', 'md', 'sm', 'xs'],
    },
    weight: {
      control: 'select',
      options: ['regular', 'medium', 'semibold'],
    },
  },
};

export default meta;

export const Default = {
  args: {
    as: 'p' as const,
    size: 'md' as const,
    weight: 'regular' as const,
    text: 'Family farm in rural Iowa. We raise heritage breed animals on pasture year-round.',
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement);
    const el = canvas.getByText(/Family farm/);
    await expect(el).toBeInTheDocument();
    await expect(el.tagName.toLowerCase()).toBe('p');
  },
};

export const Large = {
  args: {
    as: 'p' as const,
    size: 'xl' as const,
    weight: 'regular' as const,
    text: 'Supporting copy at 20px, used for hero sub-text.',
  },
};

export const Small = {
  args: {
    as: 'p' as const,
    size: 'sm' as const,
    weight: 'regular' as const,
    text: 'Small body text at 14px, used for captions and hints.',
  },
};

export const Semibold = {
  args: {
    as: 'p' as const,
    size: 'md' as const,
    weight: 'semibold' as const,
    text: 'Semibold body text for emphasis.',
  },
};

export const WithColor = {
  args: {
    as: 'p' as const,
    size: 'md' as const,
    weight: 'regular' as const,
    color: '#a5a5a5',
    text: 'Muted supporting copy.',
  },
};

export const AsSpan = {
  args: {
    as: 'span' as const,
    size: 'sm' as const,
    weight: 'medium' as const,
    text: 'Inline span text',
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement);
    const el = canvas.getByText('Inline span text');
    await expect(el.tagName.toLowerCase()).toBe('span');
  },
};
