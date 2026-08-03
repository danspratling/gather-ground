import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from 'storybook/test';
import { fn } from 'storybook/test';
import QuantityStepper from '@/components/QuantityStepper/QuantityStepper';

const meta = {
  title: 'Commerce/QuantityStepper',
  component: QuantityStepper,
  tags: ['autodocs'],
  parameters: {
    renderer: 'react',
    layout: 'centered',
    a11y: { disable: false },
    chromatic: { viewports: [375, 1440] },
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/zsTOcot4CKA5nq2ihg0ZLi/Gather-Ground-Website?node-id=0-1',
    },
  },
} satisfies Meta<typeof QuantityStepper>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: 1,
    min: 1,
    max: 99,
    onChange: fn(),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText('Quantity');
    const increment = canvas.getByLabelText('Increase quantity');
    const decrement = canvas.getByLabelText('Decrease quantity');

    // Decrement is disabled at min
    await expect(decrement).toBeDisabled();
    await expect(input).toHaveValue(1);

    // Increment once → 2
    await userEvent.click(increment);
    await expect(input).toHaveValue(2);

    // Increment again → 3 (catches the stuck-at-2 regression)
    await userEvent.click(increment);
    await expect(input).toHaveValue(3);

    // Decrement → 2
    await userEvent.click(decrement);
    await expect(input).toHaveValue(2);
  },
};

export const AtMin: Story = {
  args: {
    value: 1,
    min: 1,
    max: 99,
    onChange: fn(),
  },
};

export const AtMax: Story = {
  args: {
    value: 99,
    min: 1,
    max: 99,
    onChange: fn(),
  },
};

export const Disabled: Story = {
  args: {
    value: 2,
    min: 1,
    max: 99,
    disabled: true,
    onChange: fn(),
  },
};
