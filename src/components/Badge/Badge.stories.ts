import { expect, within } from 'storybook/test';

// @ts-expect-error — .astro files have no TypeScript declarations
import Badge from '@/components/Badge/Badge.astro';

const meta = {
  title: 'Core/Badge',
  component: Badge,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    a11y: { disable: false },
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/zsTOcot4CKA5nq2ihg0ZLi/Gather-Ground-Website?node-id=1046-3819',
    },
  },
  argTypes: {
    type: { control: 'select', options: ['pill', 'badge-modern'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    color: {
      control: 'select',
      options: [
        'gray',
        'brand',
        'error',
        'warning',
        'success',
        'blue-light',
        'blue',
        'indigo',
        'purple',
        'pink',
        'orange',
        'gray-blue',
      ],
    },
    dot: { control: 'boolean' },
    iconLeading: { control: 'boolean' },
    iconTrailing: { control: 'boolean' },
  },
};

export default meta;

export const Default = {
  args: {
    label: 'Label',
    type: 'pill' as const,
    size: 'sm' as const,
    color: 'gray' as const,
    dot: false,
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('Label')).toBeInTheDocument();
    await expect(canvas.queryByRole('button')).toBeNull();
    await expect(canvas.queryByRole('link')).toBeNull();
  },
};

export const Gray = {
  args: {
    label: 'Gray',
    type: 'pill' as const,
    size: 'sm' as const,
    color: 'gray' as const,
  },
};
export const Brand = {
  args: {
    label: 'Brand',
    type: 'pill' as const,
    size: 'sm' as const,
    color: 'brand' as const,
  },
};
export const Error = {
  args: {
    label: 'Error',
    type: 'pill' as const,
    size: 'sm' as const,
    color: 'error' as const,
  },
};
export const Warning = {
  args: {
    label: 'Warning',
    type: 'pill' as const,
    size: 'sm' as const,
    color: 'warning' as const,
  },
};
export const Success = {
  args: {
    label: 'Success',
    type: 'pill' as const,
    size: 'sm' as const,
    color: 'success' as const,
  },
};
export const BlueLight = {
  args: {
    label: 'Blue light',
    type: 'pill' as const,
    size: 'sm' as const,
    color: 'blue-light' as const,
  },
};
export const Blue = {
  args: {
    label: 'Blue',
    type: 'pill' as const,
    size: 'sm' as const,
    color: 'blue' as const,
  },
};
export const Indigo = {
  args: {
    label: 'Indigo',
    type: 'pill' as const,
    size: 'sm' as const,
    color: 'indigo' as const,
  },
};
export const Purple = {
  args: {
    label: 'Purple',
    type: 'pill' as const,
    size: 'sm' as const,
    color: 'purple' as const,
  },
};
export const Pink = {
  args: {
    label: 'Pink',
    type: 'pill' as const,
    size: 'sm' as const,
    color: 'pink' as const,
  },
};
export const Orange = {
  args: {
    label: 'Orange',
    type: 'pill' as const,
    size: 'sm' as const,
    color: 'orange' as const,
  },
};
export const GrayBlue = {
  args: {
    label: 'Gray blue',
    type: 'pill' as const,
    size: 'sm' as const,
    color: 'gray-blue' as const,
  },
};

// Size scale
export const SizeSm = {
  args: {
    label: 'Small',
    type: 'pill' as const,
    size: 'sm' as const,
    color: 'gray' as const,
  },
};
export const SizeMd = {
  args: {
    label: 'Medium',
    type: 'pill' as const,
    size: 'md' as const,
    color: 'gray' as const,
  },
};
export const SizeLg = {
  args: {
    label: 'Large',
    type: 'pill' as const,
    size: 'lg' as const,
    color: 'gray' as const,
  },
};

// Dot variant
export const WithDot = {
  args: {
    label: 'Live',
    type: 'pill' as const,
    size: 'sm' as const,
    color: 'success' as const,
    dot: true,
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('Live')).toBeInTheDocument();
    await expect(canvas.queryByRole('button')).toBeNull();
  },
};

// Icon variants
export const WithLeadingIcon = {
  args: {
    label: 'Label',
    type: 'pill' as const,
    size: 'sm' as const,
    color: 'gray' as const,
    iconLeading: true,
  },
};

export const WithTrailingIcon = {
  args: {
    label: 'Label',
    type: 'pill' as const,
    size: 'sm' as const,
    color: 'gray' as const,
    iconTrailing: true,
  },
};

// badge-modern
export const Modern = {
  args: {
    label: 'New',
    type: 'badge-modern' as const,
    size: 'sm' as const,
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('New')).toBeInTheDocument();
    await expect(canvas.queryByRole('button')).toBeNull();
  },
};
