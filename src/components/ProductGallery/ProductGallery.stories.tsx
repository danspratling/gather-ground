import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from 'storybook/test';

import ProductGallery from '@/components/ProductGallery/ProductGallery';

const meta = {
  title: 'Commerce/Product Gallery',
  component: ProductGallery,
  tags: ['autodocs'],
  parameters: {
    renderer: 'react',
    layout: 'padded',
    a11y: { disable: false },
    chromatic: { viewports: [375, 1440] },
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/zsTOcot4CKA5nq2ihg0ZLi/Gather-Ground-Website?node-id=0-1',
    },
  },
} satisfies Meta<typeof ProductGallery>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- Shared mock data ---

const mockImages = [
  {
    url: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=800&h=800&fit=crop',
    altText: 'Free-range pork belly',
  },
  {
    url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&h=800&fit=crop',
    altText: 'Pork belly close-up',
  },
  {
    url: 'https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=800&h=800&fit=crop',
    altText: 'Farm-raised pork',
  },
];

// --- Stories ---

export const Default: Story = {
  args: {
    images: mockImages,
    productTitle: 'Free-Range Pork Belly',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const thumbButtons = canvas.getAllByRole('button', { name: /View image/i });
    expect(thumbButtons.length).toBeGreaterThan(0);
    await userEvent.click(thumbButtons[1]);
  },
};

export const SingleImage: Story = {
  args: {
    images: [mockImages[0]],
    productTitle: 'Free-Range Pork Belly',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const thumbButtons = canvas.queryAllByRole('button', {
      name: /View image/i,
    });
    expect(thumbButtons.length).toBe(0);
  },
};

export const WithLightbox: Story = {
  args: {
    images: mockImages,
    productTitle: 'Free-Range Pork Belly',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const lightboxTrigger = canvas.getByRole('button', {
      name: /Open image lightbox/i,
    });
    await userEvent.click(lightboxTrigger);
    const dialog = await canvas.findByRole('dialog');
    expect(dialog).toBeInTheDocument();
  },
};
