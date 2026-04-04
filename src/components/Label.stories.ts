import { expect, within } from 'storybook/test';

// @ts-expect-error — .astro files have no TypeScript declarations
import Label from '@/components/Label.astro';

const meta = {
  title: 'Components/Typography/Label',
  component: Label,
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
    size: {
      control: 'select',
      options: ['sm', 'md'],
    },
  },
};

export default meta;

export const Default = {
  args: {
    size: 'md' as const,
    text: 'Products',
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement);
    const el = canvas.getByText('Products');
    await expect(el).toBeInTheDocument();
    await expect(el).toHaveClass('font-semibold');
  },
};

export const Small = {
  args: {
    size: 'sm' as const,
    text: 'News',
  },
};

export const WithColor = {
  args: {
    size: 'md' as const,
    color: '#3b3b3b',
    text: 'Our Story',
  },
};
