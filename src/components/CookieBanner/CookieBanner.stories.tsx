import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from 'storybook/test';
import CookieBanner from './CookieBanner';

const meta: Meta<typeof CookieBanner> = {
  title: 'Legal/CookieBanner',
  component: CookieBanner,
  parameters: {
    renderer: 'react',
  },
  decorators: [
    (Story) => {
      try {
        localStorage.removeItem('cookie-consent');
      } catch {}
      return <Story />;
    },
  ],
};

export default meta;
type Story = StoryObj<typeof CookieBanner>;

export const Default: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const banner = await canvas.findByRole('region', {
      name: /cookie consent/i,
    });
    await expect(banner).toBeVisible();
  },
};

export const Accept: Story = {
  args: {},
  decorators: [
    (Story) => {
      try {
        localStorage.removeItem('cookie-consent');
      } catch {}
      return <Story />;
    },
  ],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const banner = await canvas.findByRole('region', {
      name: /cookie consent/i,
    });

    await userEvent.click(canvas.getByRole('button', { name: /accept/i }));

    await expect(banner).not.toBeInTheDocument();
    await expect(localStorage.getItem('cookie-consent')).toBe('accepted');
  },
};

export const Decline: Story = {
  args: {},
  decorators: [
    (Story) => {
      try {
        localStorage.removeItem('cookie-consent');
      } catch {}
      return <Story />;
    },
  ],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const banner = await canvas.findByRole('region', {
      name: /cookie consent/i,
    });

    await userEvent.click(canvas.getByRole('button', { name: /decline/i }));

    await expect(banner).not.toBeInTheDocument();
    await expect(localStorage.getItem('cookie-consent')).toBe('declined');
  },
};
