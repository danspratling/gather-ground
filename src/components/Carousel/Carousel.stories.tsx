import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, waitFor, within } from 'storybook/test';

import Carousel from '@/components/Carousel/Carousel';

const ProductCard = ({
  title,
  href,
  image,
}: {
  title: string;
  href: string;
  image: string;
}) => (
  <a
    href={href}
    className="flex w-60 flex-col gap-3 rounded-xl bg-secondary-50 p-4 no-underline"
  >
    <img
      src={image}
      alt={title}
      className="aspect-square w-full rounded-lg object-cover"
    />
    <p className="text-sm font-semibold text-gray-900">{title}</p>
  </a>
);

const TestimonialCard = ({
  quote,
  author,
}: {
  quote: string;
  author: string;
}) => (
  <article className="flex w-80 flex-col gap-6 rounded-xl bg-secondary-50 p-8">
    <blockquote className="text-base font-normal text-gray-900">
      &ldquo;{quote}&rdquo;
    </blockquote>
    <p className="text-sm font-medium text-gray-600">{author}</p>
  </article>
);

const meta = {
  title: 'Core/Carousel',
  component: Carousel,
  tags: ['autodocs'],
  parameters: {
    renderer: 'react',
    layout: 'padded',
    a11y: { disable: false },
  },
} satisfies Meta<typeof Carousel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithButtons: Story = {
  args: {},
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/zsTOcot4CKA5nq2ihg0ZLi/Gather-Ground-Website?node-id=18582-59517',
    },
  },
  render: () => (
    <Carousel variant="buttons" label="Product carousel">
      <ProductCard
        title="Beef topside roasting joint"
        href="/products/beef"
        image="https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&q=80"
      />
      <ProductCard
        title="Beef Mince 15% lean"
        href="/products/mince"
        image="https://images.unsplash.com/photo-1558030006-450675393462?w=400&q=80"
      />
      <ProductCard
        title="Pork belly"
        href="/products/pork"
        image="https://images.unsplash.com/photo-1432139555190-58524dae6a55?w=400&q=80"
      />
      <ProductCard
        title="Whole Chicken"
        href="/products/chicken"
        image="https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400&q=80"
      />
    </Carousel>
  ),
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement);

    const prevBtn = canvas.getByRole('button', { name: 'Previous slide' });
    const nextBtn = canvas.getByRole('button', { name: 'Next slide' });

    // Previous should be disabled at the start
    await expect(prevBtn).toBeDisabled();
    await expect(nextBtn).not.toBeDisabled();

    // Advance one slide
    await userEvent.click(nextBtn);

    // Previous should now be enabled
    await waitFor(() => expect(prevBtn).not.toBeDisabled());

    // Go back
    await userEvent.click(prevBtn);
    await waitFor(() => expect(prevBtn).toBeDisabled());
  },
};

export const WithDots: Story = {
  args: {},
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/zsTOcot4CKA5nq2ihg0ZLi/Gather-Ground-Website?node-id=1647-392096',
    },
  },
  render: () => (
    <Carousel variant="dots" label="Testimonials carousel">
      <TestimonialCard
        quote="We've been using Gather Ground for every special occasion. The quality is unmatched."
        author="Sienna Hewitt · @siennahewitt"
      />
      <TestimonialCard
        quote="From concept to completion, the produce helps us deliver outstanding meals faster than ever."
        author="Kari Rasmussen · @itskari"
      />
      <TestimonialCard
        quote="The shortribs were absolutely incredible. Best I have ever had."
        author="Jordan Blake · @jordanblake"
      />
    </Carousel>
  ),
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement);

    // Dots should be rendered with correct aria-labels
    const slide1Dot = canvas.getByRole('button', { name: 'Go to slide 1' });
    await expect(slide1Dot).toBeInTheDocument();

    await waitFor(() =>
      expect(
        canvas.getByRole('button', { name: 'Go to slide 2' })
      ).toBeInTheDocument()
    );

    const slide2Dot = canvas.getByRole('button', { name: 'Go to slide 2' });

    // Navigate to slide 2
    await userEvent.click(slide2Dot);
    await waitFor(() => expect(slide2Dot).toBeInTheDocument());
  },
};
