import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from 'storybook/test';

import NewsletterForm from '@/components/NewsletterForm/NewsletterForm';

const meta = {
  title: 'Core/Newsletter Form',
  component: NewsletterForm,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    renderer: 'react',
    backgrounds: {
      default: 'dark',
      values: [{ name: 'dark', value: '#171717' }],
    },
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/zsTOcot4CKA5nq2ihg0ZLi/Gather-Ground-Website?node-id=1647-376190',
    },
  },
} satisfies Meta<typeof NewsletterForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    heading: 'Stay up to date',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const input = canvas.getByRole('textbox', { name: /email address/i });
    const button = canvas.getByRole('button', { name: /subscribe/i });

    await expect(input).toBeInTheDocument();
    await expect(button).toBeInTheDocument();

    await userEvent.type(input, 'hello@example.com');
    await expect(input).toHaveValue('hello@example.com');

    await userEvent.click(button);

    const successMessage = await canvas.findByTestId('success-message');
    await expect(successMessage).toBeInTheDocument();
  },
};

export const CustomHeading: Story = {
  args: {
    heading: 'Join our farm newsletter',
  },
};
