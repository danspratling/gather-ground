import { expect, within } from 'storybook/test';

import Input from '@/components/Forms/Input/Input.astro';

const meta = {
  title: 'Core/Input',
  component: Input,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    a11y: { disable: false },
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/zsTOcot4CKA5nq2ihg0ZLi/Gather-Ground-Website?node-id=1091-61583',
    },
  },
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'email', 'tel', 'url', 'password'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md'],
    },
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
    iconLeading: { control: 'boolean' },
  },
};

export default meta;

export const Default = {
  args: {
    name: 'email',
    label: 'Email address',
    type: 'email' as const,
    size: 'md' as const,
    placeholder: 'you@example.com',
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('textbox', { name: 'Email address' });
    await expect(input).toBeInTheDocument();
    await expect(input).not.toBeDisabled();
  },
};

export const WithHint = {
  args: {
    name: 'email-hint',
    label: 'Email address',
    type: 'email' as const,
    placeholder: 'you@example.com',
    hint: "We'll only use this to send you updates.",
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('textbox', { name: 'Email address' });
    await expect(input).toHaveAttribute('aria-describedby', 'email-hint-hint');
    await expect(canvas.getByText(/We'll only use/)).toBeInTheDocument();
  },
};

export const WithError = {
  args: {
    name: 'email-error',
    label: 'Email address',
    type: 'email' as const,
    placeholder: 'you@example.com',
    error: 'Please enter a valid email address.',
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('textbox', { name: 'Email address' });
    await expect(input).toHaveAttribute('aria-invalid', 'true');
    await expect(canvas.getByText(/valid email/)).toBeInTheDocument();
  },
};

export const Required = {
  args: {
    name: 'name-required',
    label: 'Full name',
    type: 'text' as const,
    placeholder: 'Jane Smith',
    required: true,
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('textbox', { name: /Full name/ });
    await expect(input).toHaveAttribute('required');
    await expect(input).toHaveAttribute('aria-required', 'true');
  },
};

export const Disabled = {
  args: {
    name: 'name-disabled',
    label: 'Full name',
    type: 'text' as const,
    placeholder: 'Jane Smith',
    disabled: true,
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('textbox', { name: 'Full name' });
    await expect(input).toBeDisabled();
  },
};

export const Small = {
  args: {
    name: 'search-sm',
    label: 'Search',
    size: 'sm' as const,
    placeholder: 'Search…',
    iconLeading: true,
  },
};

export const NoLabel = {
  args: {
    name: 'search-nolabel',
    placeholder: 'Search…',
    iconLeading: true,
  },
};
