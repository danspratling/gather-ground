import type { Meta, StoryObj } from '@storybook/react';

import TestimonialsSection from '@/components/TestimonialsSection/TestimonialsSection';

const meta = {
  title: 'Sections/Testimonials Section',
  component: TestimonialsSection,
  tags: ['autodocs'],
  parameters: {
    renderer: 'react',
    layout: 'fullscreen',
    a11y: { disable: false },
    chromatic: { viewports: [375, 1440] },
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/zsTOcot4CKA5nq2ihg0ZLi/Gather-Ground-Website?node-id=1647-392096',
    },
  },
} satisfies Meta<typeof TestimonialsSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    heading: 'Wall of love',
    subCopy: 'Hear first-hand from our incredible community of customers.',
    testimonials: [
      {
        quote:
          "We've been using Gather Ground to source our meat and can't imagine getting it anywhere else.",
        rating: 5,
        author: {
          src: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face',
          alt: 'Sienna Hewitt',
          name: 'Sienna Hewitt',
          secondary: '@siennahewitt',
          secondaryIsHandle: true,
          size: 'md',
        },
      },
      {
        quote:
          'From concept to completion, Gather Ground helps us deliver outstanding meals faster than ever.',
        rating: 5,
        author: {
          src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face',
          alt: 'Kari Rasmussen',
          name: 'Kari Rasmussen',
          secondary: '@itskari',
          secondaryIsHandle: true,
          size: 'md',
        },
      },
      {
        quote:
          'Incredible quality meat delivered straight to our door. The whole family loves it.',
        rating: 5,
        author: {
          src: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face',
          alt: 'Lena Park',
          name: 'Lena Park',
          secondary: '@lenapark',
          secondaryIsHandle: true,
          size: 'md',
        },
      },
    ],
  },
};
