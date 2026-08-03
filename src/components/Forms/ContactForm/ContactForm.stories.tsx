import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from 'storybook/test';
import ContactForm from './ContactForm';

const meta: Meta<typeof ContactForm> = {
  title: 'Forms/ContactForm',
  component: ContactForm,
  parameters: {
    renderer: 'react',
  },
};

export default meta;
type Story = StoryObj<typeof ContactForm>;

export const Default: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // All required fields should be present
    await expect(canvas.getByLabelText(/first name/i)).toBeInTheDocument();
    await expect(canvas.getByLabelText(/last name/i)).toBeInTheDocument();
    await expect(canvas.getByLabelText(/email/i)).toBeInTheDocument();
    await expect(canvas.getByLabelText(/message/i)).toBeInTheDocument();
    await expect(
      canvas.getByRole('button', { name: /send message/i })
    ).toBeInTheDocument();
  },
};

/**
 * Mocks fetch to return a success response so the success state is reachable
 * without Turnstile or a live API.
 */
export const SubmitSuccess: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const originalFetch = window.fetch;
    window.fetch = async () =>
      new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });

    try {
      await userEvent.type(canvas.getByLabelText(/first name/i), 'Jane');
      await userEvent.type(canvas.getByLabelText(/last name/i), 'Smith');
      await userEvent.type(canvas.getByLabelText(/email/i), 'jane@example.com');
      await userEvent.type(canvas.getByLabelText(/message/i), 'Hello there!');
      await userEvent.click(canvas.getByLabelText(/i agree/i));

      await userEvent.click(
        canvas.getByRole('button', { name: /send message/i })
      );

      await expect(await canvas.findByText(/message sent/i)).toBeVisible();
    } finally {
      window.fetch = originalFetch;
    }
  },
};

/**
 * Mocks fetch to return a server error so the error message is shown.
 */
export const SubmitError: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const originalFetch = window.fetch;
    window.fetch = async () =>
      new Response(
        JSON.stringify({
          success: false,
          error: 'Server error. Please try again.',
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );

    try {
      await userEvent.type(canvas.getByLabelText(/first name/i), 'Jane');
      await userEvent.type(canvas.getByLabelText(/last name/i), 'Smith');
      await userEvent.type(canvas.getByLabelText(/email/i), 'jane@example.com');
      await userEvent.type(canvas.getByLabelText(/message/i), 'Hello there!');
      await userEvent.click(canvas.getByLabelText(/i agree/i));

      await userEvent.click(
        canvas.getByRole('button', { name: /send message/i })
      );

      await expect(await canvas.findByText(/server error/i)).toBeVisible();
    } finally {
      window.fetch = originalFetch;
    }
  },
};
