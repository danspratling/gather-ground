import { expect, within } from 'storybook/test';

// @ts-expect-error — .astro files have no TypeScript declarations
import AvatarLabelGroup from './AvatarLabelGroup.astro';

const PLACEHOLDER = 'https://i.pravatar.cc/150?img=1';

export default {
  title: 'Core/Avatar Label Group',
  component: AvatarLabelGroup,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    a11y: { disable: false },
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/zsTOcot4CKA5nq2ihg0ZLi/Gather-Ground-Website?node-id=1109-487',
    },
  },
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg', 'xl'] },
  },
};

export const WithDate = {
  args: {
    src: PLACEHOLDER,
    alt: 'Sarah Johnson',
    name: 'Sarah Johnson',
    secondary: 'March 14, 2025',
    secondaryIsHandle: false,
    size: 'md' as const,
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('Sarah Johnson')).toBeInTheDocument();
    await expect(canvas.getByText('March 14, 2025')).toBeInTheDocument();
    await expect(canvas.getByRole('img').getAttribute('alt')).toBeTruthy();
  },
};

export const WithHandle = {
  args: {
    src: PLACEHOLDER,
    alt: 'Sarah Johnson',
    name: 'Sarah Johnson',
    secondary: '@sarahjohnson',
    secondaryIsHandle: true,
    size: 'md' as const,
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('@sarahjohnson')).toBeInTheDocument();
    await expect(canvas.getByRole('img').getAttribute('alt')).toBeTruthy();
  },
};

export const NoSecondary = {
  args: {
    src: PLACEHOLDER,
    alt: 'Sarah Johnson',
    name: 'Sarah Johnson',
    size: 'md' as const,
  },
};
