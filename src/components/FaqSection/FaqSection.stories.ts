// @storybook-astro/framework does not export Meta/StoryObj — Astro stories are untyped by design.
// See: https://storybook-astro.org/writing-stories/
import { expect, within } from 'storybook/test';

import FaqSection from '@/components/FaqSection/FaqSection.astro';

const meta = {
  title: 'Sections/FAQ Section',
  component: FaqSection,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    a11y: { disable: false },
    chromatic: { viewports: [375, 1440] },
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/zsTOcot4CKA5nq2ihg0ZLi/Gather-Ground-Website?node-id=1647-392826',
    },
  },
};

export default meta;

const defaultItems = [
  {
    title: 'Where can I find your products?',
    detail:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
  },
  {
    title: 'Do you deliver?',
    detail:
      'We ship weekly to most of the continental US, and offer local pickup at the farm. Delivery is free on orders over $75.',
  },
  {
    title: "Who's building Gather Ground?",
    detail:
      "Gather Ground is a family-run farm in rural Iowa. We've been raising heritage breed animals on pasture for over a decade.",
  },
  {
    title: 'Are your animals grass-fed?',
    detail:
      'Yes — all our animals are raised on pasture year-round with supplemental feed as needed during winter months.',
  },
  {
    title: 'Do you offer subscriptions?',
    detail:
      'We are working on a subscription box — sign up to our newsletter to be the first to know when it launches.',
  },
  {
    title: 'What if I have a question not listed here?',
    detail:
      'Reach out via the contact form and our team will get back to you within one business day.',
  },
];

export const Default = {
  args: {
    heading: 'About Gather Ground',
    subCopy:
      'Everything you need to know about who we are, how we raise our animals, and how to get our products delivered to your door.',
    items: defaultItems,
    cta: {
      heading: 'Want to find out more?',
      body: "If you have any questions about our products or how we tackle modern sustainable farming at Gather Ground reach out and we'll get back to you asap",
      primaryButton: {
        label: 'Get in touch',
        href: '#',
        variant: 'default' as const,
        size: 'md' as const,
      },
      secondaryButton: {
        label: 'About us',
        href: '#',
        variant: 'outline' as const,
        size: 'md' as const,
      },
      avatarGroup: {
        avatars: [
          {
            src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face',
            alt: 'Team member 1',
          },
          {
            src: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face',
            alt: 'Team member 2',
          },
        ],
        size: 'md' as const,
      },
    },
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement);

    // Heading is visible
    await expect(
      await canvas.findByRole('heading', { name: 'About Gather Ground' })
    ).toBeInTheDocument();

    // All FAQ questions are rendered
    await expect(
      await canvas.findByText('Where can I find your products?')
    ).toBeInTheDocument();
    await expect(
      await canvas.findByText('Do you deliver?')
    ).toBeInTheDocument();

    // CTA is visible
    await expect(
      await canvas.findByRole('heading', { name: 'Want to find out more?' })
    ).toBeInTheDocument();
    await expect(
      await canvas.findByRole('link', { name: 'Get in touch' })
    ).toBeInTheDocument();
  },
};
