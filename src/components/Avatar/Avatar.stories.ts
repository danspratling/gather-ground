import { expect, within } from 'storybook/test';

// @ts-expect-error — .astro files have no TypeScript declarations
import Avatar from './Avatar.astro';

const PLACEHOLDER = 'https://i.pravatar.cc/150?img=1';

export default {
  title: 'Core/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    a11y: { disable: false },
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/zsTOcot4CKA5nq2ihg0ZLi/Gather-Ground-Website?node-id=19-1016',
    },
  },
  argTypes: {
    size: { control: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl', '2xl'] },
  },
};

export const Default = {
  args: {
    src: PLACEHOLDER,
    alt: 'Jane Smith',
    size: 'md' as const,
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement);
    const img = canvas.getByRole('img');
    await expect(img).toBeInTheDocument();
    await expect(img.getAttribute('alt')).toBeTruthy();
  },
};

export const SizeXs = {
  args: { src: PLACEHOLDER, alt: 'Jane Smith', size: 'xs' as const },
};
export const SizeSm = {
  args: { src: PLACEHOLDER, alt: 'Jane Smith', size: 'sm' as const },
};
export const SizeMd = {
  args: { src: PLACEHOLDER, alt: 'Jane Smith', size: 'md' as const },
};
export const SizeLg = {
  args: { src: PLACEHOLDER, alt: 'Jane Smith', size: 'lg' as const },
};
export const SizeXl = {
  args: { src: PLACEHOLDER, alt: 'Jane Smith', size: 'xl' as const },
};
export const Size2xl = {
  args: { src: PLACEHOLDER, alt: 'Jane Smith', size: '2xl' as const },
};
