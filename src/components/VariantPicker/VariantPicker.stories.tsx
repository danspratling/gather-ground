import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from 'storybook/test';

import VariantPicker from '@/components/VariantPicker/VariantPicker';

const meta = {
  title: 'Commerce/Variant Picker',
  component: VariantPicker,
  tags: ['autodocs'],
  parameters: {
    renderer: 'react',
    layout: 'padded',
    a11y: { disable: false },
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/zsTOcot4CKA5nq2ihg0ZLi/Gather-Ground-Website?node-id=0-1',
    },
    chromatic: { viewports: [375, 1440] },
  },
} satisfies Meta<typeof VariantPicker>;

export default meta;
type Story = StoryObj<typeof meta>;

const sizeOption = {
  id: 'opt-size',
  name: 'Size',
  values: [
    { id: 'val-s', name: 'S' },
    { id: 'val-m', name: 'M' },
    { id: 'val-l', name: 'L' },
  ],
};

const colorOption = {
  id: 'opt-color',
  name: 'Color',
  values: [
    { id: 'val-red', name: 'Red' },
    { id: 'val-blue', name: 'Blue' },
  ],
};

const basePrice = { amount: 1499, currency: 'GBP', formatted: '£14.99' };

const allVariants = [
  {
    id: 'var-s-red',
    name: 'S / Red',
    sku: 'SKU-S-RED',
    price: basePrice,
    selectedOptions: { Size: 'S', Color: 'Red' },
    inventoryStatus: 'in_stock' as const,
  },
  {
    id: 'var-s-blue',
    name: 'S / Blue',
    sku: 'SKU-S-BLUE',
    price: basePrice,
    selectedOptions: { Size: 'S', Color: 'Blue' },
    inventoryStatus: 'in_stock' as const,
  },
  {
    id: 'var-m-red',
    name: 'M / Red',
    sku: 'SKU-M-RED',
    price: basePrice,
    selectedOptions: { Size: 'M', Color: 'Red' },
    inventoryStatus: 'in_stock' as const,
  },
  {
    id: 'var-m-blue',
    name: 'M / Blue',
    sku: 'SKU-M-BLUE',
    price: basePrice,
    selectedOptions: { Size: 'M', Color: 'Blue' },
    inventoryStatus: 'in_stock' as const,
  },
  {
    id: 'var-l-red',
    name: 'L / Red',
    sku: 'SKU-L-RED',
    price: basePrice,
    selectedOptions: { Size: 'L', Color: 'Red' },
    inventoryStatus: 'in_stock' as const,
  },
  {
    id: 'var-l-blue',
    name: 'L / Blue',
    sku: 'SKU-L-BLUE',
    price: basePrice,
    selectedOptions: { Size: 'L', Color: 'Blue' },
    inventoryStatus: 'in_stock' as const,
  },
];

export const Default: Story = {
  args: {
    options: [sizeOption, colorOption],
    variants: allVariants,
    selectedVariantId: 'var-m-red',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // M is the initial selection — aria-pressed true
    const mButton = canvas.getByRole('button', { name: 'M' });
    await expect(mButton).toHaveAttribute('aria-pressed', 'true');

    // Click L — selection updates
    const lButton = canvas.getByRole('button', { name: 'L' });
    await userEvent.click(lButton);
    await expect(lButton).toHaveAttribute('aria-pressed', 'true');
    await expect(mButton).toHaveAttribute('aria-pressed', 'false');
  },
};

export const SingleOption: Story = {
  args: {
    options: [sizeOption],
    variants: [
      {
        id: 'var-s',
        name: 'S',
        sku: 'SKU-S',
        price: basePrice,
        selectedOptions: { Size: 'S' },
        inventoryStatus: 'in_stock' as const,
      },
      {
        id: 'var-m',
        name: 'M',
        sku: 'SKU-M',
        price: basePrice,
        selectedOptions: { Size: 'M' },
        inventoryStatus: 'in_stock' as const,
      },
      {
        id: 'var-l',
        name: 'L',
        sku: 'SKU-L',
        price: basePrice,
        selectedOptions: { Size: 'L' },
        inventoryStatus: 'in_stock' as const,
      },
    ],
    selectedVariantId: 'var-m',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const sButton = canvas.getByRole('button', { name: 'S' });
    const mButton = canvas.getByRole('button', { name: 'M' });

    await expect(mButton).toHaveAttribute('aria-pressed', 'true');

    await userEvent.click(sButton);
    await expect(sButton).toHaveAttribute('aria-pressed', 'true');
    await expect(mButton).toHaveAttribute('aria-pressed', 'false');
  },
};

export const WithOOSVariant: Story = {
  args: {
    options: [sizeOption, colorOption],
    variants: allVariants.map((v) =>
      v.id === 'var-l-red'
        ? { ...v, inventoryStatus: 'out_of_stock' as const }
        : v
    ),
    selectedVariantId: 'var-m-red',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Initial selection is M/Red. L/Red is OOS — the "L" button carries an
    // OOS aria-label but is NOT disabled (OOS variants are selectable).
    const lOOSButton = canvas.getByRole('button', {
      name: 'L — out of stock',
    });
    await expect(lOOSButton).not.toBeDisabled();

    // Click the OOS L button — it selects L (resolves to L/Red, still OOS).
    await userEvent.click(lOOSButton);
    await expect(lOOSButton).toHaveAttribute('aria-pressed', 'true');

    // Switch to Blue — L/Blue is in stock so the colour button is enabled.
    const blueButton = canvas.getByRole('button', { name: 'Blue' });
    await expect(blueButton).not.toBeDisabled();
    await userEvent.click(blueButton);
    await expect(blueButton).toHaveAttribute('aria-pressed', 'true');

    // Blue is in stock for L, Red is OOS for L — Red shows OOS label but enabled.
    await expect(
      canvas.getByRole('button', { name: /red — out of stock/i })
    ).not.toBeDisabled();
  },
};
