import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from 'storybook/test';

import LoginForm from './LoginForm';

const meta = {
  title: 'Forms/LoginForm',
  component: LoginForm,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    renderer: 'react',
  },
} satisfies Meta<typeof LoginForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

/**
 * Submits with an invalid email and blank password to surface both field-level
 * validation messages without hitting the network.
 */
export const WithErrors: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const email = canvas.getByLabelText(/email/i);
    const submit = canvas.getByRole('button', { name: /sign in/i });

    await userEvent.type(email, 'not-an-email');
    await userEvent.click(submit);

    await expect(
      await canvas.findByTestId('login-email-error')
    ).toHaveTextContent(/valid email/i);
    await expect(
      await canvas.findByTestId('login-password-error')
    ).toHaveTextContent(/required/i);
  },
};

/**
 * Freezes `fetch` on a never-resolving promise so the button stays in its
 * disabled "Signing in…" state after a valid submit.
 */
export const Loading: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const originalFetch = window.fetch;
    window.fetch = () => new Promise(() => {});

    try {
      await userEvent.type(canvas.getByLabelText(/email/i), 'jane@example.com');
      await userEvent.type(canvas.getByLabelText(/password/i), 'hunter22!');
      await userEvent.click(canvas.getByRole('button', { name: /sign in/i }));

      const button = await canvas.findByRole('button', {
        name: /signing in/i,
      });
      await expect(button).toBeDisabled();
    } finally {
      // Restore even though the fetch is still pending — no other code in this
      // story cares about it after the assertion runs.
      window.fetch = originalFetch;
    }
  },
};
