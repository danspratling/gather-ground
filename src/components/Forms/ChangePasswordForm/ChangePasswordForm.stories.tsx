import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from 'storybook/test';

import ChangePasswordForm from './ChangePasswordForm';

const meta = {
  title: 'Forms/ChangePasswordForm',
  component: ChangePasswordForm,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    renderer: 'react',
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/placeholder',
    },
  },
} satisfies Meta<typeof ChangePasswordForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

/**
 * Freezes `fetch` on a never-resolving promise so the button stays in its
 * disabled "Updating…" state after a valid submit.
 */
export const Submitting: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const originalFetch = window.fetch;
    const hangingFetch: typeof window.fetch = () => new Promise(() => {});
    window.fetch = hangingFetch;

    try {
      await userEvent.type(
        canvas.getByLabelText(/current password/i),
        'oldpass123!'
      );
      await userEvent.type(
        canvas.getByLabelText(/^new password/i),
        'newpass123!'
      );
      await userEvent.type(
        canvas.getByLabelText(/confirm new password/i),
        'newpass123!'
      );
      await userEvent.click(
        canvas.getByRole('button', { name: /update password/i })
      );

      const button = await canvas.findByRole('button', { name: /updating/i });
      await expect(button).toBeDisabled();
    } finally {
      window.fetch = originalFetch;
    }
  },
};

/**
 * Stubs fetch with a 200 response and asserts the success banner appears.
 */
export const Success: Story = {
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
      await userEvent.type(
        canvas.getByLabelText(/current password/i),
        'oldpass123!'
      );
      await userEvent.type(
        canvas.getByLabelText(/^new password/i),
        'newpass123!'
      );
      await userEvent.type(
        canvas.getByLabelText(/confirm new password/i),
        'newpass123!'
      );
      await userEvent.click(
        canvas.getByRole('button', { name: /update password/i })
      );

      const success = await canvas.findByTestId('change-password-success');
      await expect(success).toHaveTextContent(/updated successfully/i);
    } finally {
      window.fetch = originalFetch;
    }
  },
};

/**
 * Stubs fetch with a 401 response (wrong current password) and asserts the
 * error banner appears.
 */
export const Error: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const originalFetch = window.fetch;
    const errorFetch: typeof window.fetch = async () =>
      new Response(
        JSON.stringify({ error: 'Current password is incorrect.' }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    window.fetch = errorFetch;

    try {
      await userEvent.type(
        canvas.getByLabelText(/current password/i),
        'wrongpass!'
      );
      await userEvent.type(
        canvas.getByLabelText(/^new password/i),
        'newpass123!'
      );
      await userEvent.type(
        canvas.getByLabelText(/confirm new password/i),
        'newpass123!'
      );
      await userEvent.click(
        canvas.getByRole('button', { name: /update password/i })
      );

      const error = await canvas.findByTestId('change-password-error');
      await expect(error).toHaveTextContent(/incorrect/i);
    } finally {
      window.fetch = originalFetch;
    }
  },
};
