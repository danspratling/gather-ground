import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from 'storybook/test';

import ForgotPasswordForm from './ForgotPasswordForm';

const meta = {
  title: 'Forms/ForgotPasswordForm',
  component: ForgotPasswordForm,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    renderer: 'react',
  },
} satisfies Meta<typeof ForgotPasswordForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

/**
 * Stubs the request endpoint with a 200 so the play function drives the
 * component into its "Check your inbox" state and asserts the anti-enumeration
 * copy is present.
 */
export const Submitted: Story = {
  args: {},
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
      await userEvent.type(canvas.getByLabelText(/email/i), 'jane@example.com');
      await userEvent.click(
        canvas.getByRole('button', { name: /send reset link/i })
      );

      const success = await canvas.findByTestId('forgot-password-submitted');
      await expect(success).toHaveTextContent(/if an account exists/i);
    } finally {
      window.fetch = originalFetch;
    }
  },
};
