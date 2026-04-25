import type { Meta, StoryObj } from '@storybook/react';
import CookieBanner from './CookieBanner';

const meta: Meta<typeof CookieBanner> = {
  title: 'Legal/CookieBanner',
  component: CookieBanner,
  parameters: {
    renderer: 'react',
    design: { type: 'figma', url: '' },
  },
};

export default meta;
type Story = StoryObj<typeof CookieBanner>;

export const Default: Story = {
  args: {},
};
