import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from 'storybook/test';

import RegisterForm from './RegisterForm';

const meta = {
  title: 'Forms/RegisterForm',
  component: RegisterForm,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    renderer: 'react',
  },
} satisfies Meta<typeof RegisterForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

/**
 * Submits an empty form and asserts every required-field error appears.
 * Also verifies that a short password surfaces the min-length message.
 */
export const WithErrors: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Empty submit: firstName, lastName, email, password should all error.
    await userEvent.click(
      canvas.getByRole('button', { name: /create account/i })
    );
    await expect(
      await canvas.findByTestId('register-first-name-error')
    ).toHaveTextContent(/required/i);
    await expect(
      await canvas.findByTestId('register-last-name-error')
    ).toHaveTextContent(/required/i);
    await expect(
      await canvas.findByTestId('register-email-error')
    ).toHaveTextContent(/required/i);
    await expect(
      await canvas.findByTestId('register-password-error')
    ).toHaveTextContent(/required/i);

    // Now fill enough to move past required checks but with a too-short
    // password to hit the length branch.
    await userEvent.type(canvas.getByLabelText(/first name/i), 'Jane');
    await userEvent.type(canvas.getByLabelText(/last name/i), 'Smith');
    await userEvent.type(canvas.getByLabelText(/email/i), 'jane@example.com');
    await userEvent.type(canvas.getByLabelText(/^password/i), 'short');
    await userEvent.click(
      canvas.getByRole('button', { name: /create account/i })
    );
    await expect(
      await canvas.findByTestId('register-password-error')
    ).toHaveTextContent(/at least 8/i);
  },
};

/**
 * Freezes fetch on a never-resolving promise so the button stays disabled
 * in its 'Creating account…' state after a valid submit.
 */
export const Loading: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const originalFetch = window.fetch;
    const hangingFetch: typeof window.fetch = () => new Promise(() => {});
    window.fetch = hangingFetch;

    try {
      await userEvent.type(canvas.getByLabelText(/first name/i), 'Jane');
      await userEvent.type(canvas.getByLabelText(/last name/i), 'Smith');
      await userEvent.type(canvas.getByLabelText(/email/i), 'jane@example.com');
      await userEvent.type(canvas.getByLabelText(/^password/i), 'hunter22!');
      await userEvent.click(
        canvas.getByRole('button', { name: /create account/i })
      );

      const button = await canvas.findByRole('button', {
        name: /creating account/i,
      });
      await expect(button).toBeDisabled();
    } finally {
      window.fetch = originalFetch;
    }
  },
};
