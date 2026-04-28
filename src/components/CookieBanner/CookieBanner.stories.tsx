import type { Meta, StoryObj } from '@storybook/react';
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
};
