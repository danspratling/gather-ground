// @storybook-astro/framework does not export Meta/StoryObj — Astro stories are untyped by design.
// See: https://storybook-astro.org/writing-stories/
import { expect, within } from 'storybook/test';

// @ts-expect-error — .astro files have no TypeScript declarations
import CallToAction from '@/components/CallToAction/CallToAction.astro';

const meta = {
  title: 'Sections/Call To Action',
  component: CallToAction,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    a11y: { disable: false },
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/zsTOcot4CKA5nq2ihg0ZLi/Gather-Ground-Website?node-id=1647-392826',
    },
  },
};

export default meta;

export const Default = {
  args: {
    heading: 'Still have questions?',
    body: "Can't find the answer you're looking for? Get in touch with our team — we're happy to help.",
    primaryButton: {
      label: 'Get in touch',
      href: '#',
      variant: 'default' as const,
      size: 'md' as const,
    },
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('Still have questions?')).toBeInTheDocument();
    await expect(
      canvas.getByRole('link', { name: 'Get in touch' })
    ).toBeInTheDocument();
  },
};

export const WithSecondaryButton = {
  args: {
    heading: 'Still have questions?',
    body: "Can't find the answer you're looking for? Get in touch with our team — we're happy to help.",
    primaryButton: {
      label: 'Get in touch',
      href: '#',
      variant: 'default' as const,
      size: 'md' as const,
    },
    secondaryButton: {
      label: 'Read the FAQ',
      href: '#faq',
      variant: 'outline' as const,
      size: 'md' as const,
    },
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole('link', { name: 'Get in touch' })
    ).toBeInTheDocument();
    await expect(
      canvas.getByRole('link', { name: 'Read the FAQ' })
    ).toBeInTheDocument();
  },
};

export const WithAvatars = {
  args: {
    heading: 'Still have questions?',
    body: "Can't find the answer you're looking for? Get in touch with our team — we're happy to help.",
    primaryButton: {
      label: 'Get in touch',
      href: '#',
      variant: 'default' as const,
      size: 'md' as const,
    },
    avatarGroup: {
      avatars: [
        { src: 'https://i.pravatar.cc/150?img=1', alt: 'Team member 1' },
        { src: 'https://i.pravatar.cc/150?img=2', alt: 'Team member 2' },
        { src: 'https://i.pravatar.cc/150?img=3', alt: 'Team member 3' },
      ],
    },
  },
};
