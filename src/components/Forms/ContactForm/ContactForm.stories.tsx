import type { Meta, StoryObj } from '@storybook/react';
import ContactForm from './ContactForm';

const meta: Meta<typeof ContactForm> = {
  title: 'Forms/ContactForm',
  component: ContactForm,
  parameters: {
    renderer: 'react',
    design: { type: 'figma', url: '' },
  },
};

export default meta;
type Story = StoryObj<typeof ContactForm>;

export const Default: Story = {
  args: {},
};
