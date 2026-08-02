import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from 'storybook/test';

import ProfileForm from './ProfileForm';

const defaultArgs = {
  initialValues: {
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane@example.com',
  },
};

const meta = {
  title: 'Forms/ProfileForm',
  component: ProfileForm,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    renderer: 'react',
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/placeholder',
    },
  },
} satisfies Meta<typeof ProfileForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: defaultArgs,
};

/**
 * Freezes `fetch` on a never-resolving promise so the button stays in its
 * disabled "Saving…" state after a valid submit.
 */
export const Submitting: Story = {
  args: defaultArgs,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const originalFetch = window.fetch;
    const hangingFetch: typeof window.fetch = () => new Promise(() => {});
    window.fetch = hangingFetch;

    try {
      await userEvent.click(
        canvas.getByRole('button', { name: /save changes/i })
      );

      const button = await canvas.findByRole('button', { name: /saving/i });
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
  args: defaultArgs,
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
      await userEvent.click(
        canvas.getByRole('button', { name: /save changes/i })
      );

      const success = await canvas.findByTestId('profile-form-success');
      await expect(success).toHaveTextContent(/updated successfully/i);
    } finally {
      window.fetch = originalFetch;
    }
  },
};

/**
 * Stubs fetch with a 500 response and asserts the error banner appears.
 */
export const Error: Story = {
  args: defaultArgs,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const originalFetch = window.fetch;
    const errorFetch: typeof window.fetch = async () =>
      new Response(
        JSON.stringify({ error: 'Something went wrong. Please try again.' }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    window.fetch = errorFetch;

    try {
      await userEvent.click(
        canvas.getByRole('button', { name: /save changes/i })
      );

      const error = await canvas.findByTestId('profile-form-error');
      await expect(error).toHaveTextContent(/something went wrong/i);
    } finally {
      window.fetch = originalFetch;
    }
  },
};
