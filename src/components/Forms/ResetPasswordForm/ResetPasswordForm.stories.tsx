import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from 'storybook/test';

import ResetPasswordForm from './ResetPasswordForm';

const meta = {
  title: 'Forms/ResetPasswordForm',
  component: ResetPasswordForm,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    renderer: 'react',
  },
} satisfies Meta<typeof ResetPasswordForm>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Happy-path render. The token comes in as a prop so Storybook doesn't have
 * to fake the query string.
 */
export const Default: Story = {
  args: {
    token: 'valid-token-abc123',
  },
};

/**
 * With no token available on either prop or URL, the form refuses to render
 * and shows the invalid-link hard error.
 */
export const InvalidToken: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      await canvas.findByTestId('reset-invalid-token')
    ).toHaveTextContent(/invalid or has expired/i);
  },
};

/**
 * Stubs fetch with a 200 response, fills the two password fields, submits,
 * and asserts the success panel is shown.
 */
export const Success: Story = {
  args: {
    token: 'valid-token-abc123',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const originalFetch = window.fetch;
    const okFetch: typeof window.fetch = async () =>
      new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    window.fetch = okFetch;

    try {
      // Anchor both ends of the regex so /new password/ doesn't also match
      // the "Confirm new password" input.
      await userEvent.type(
        canvas.getByLabelText(/^new password$/i),
        'newpass123!'
      );
      await userEvent.type(
        canvas.getByLabelText(/^confirm new password$/i),
        'newpass123!'
      );
      await userEvent.click(
        canvas.getByRole('button', { name: /update password/i })
      );

      const success = await canvas.findByTestId('reset-success');
      await expect(success).toHaveTextContent(/password updated/i);
    } finally {
      window.fetch = originalFetch;
    }
  },
};
