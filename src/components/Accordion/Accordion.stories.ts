import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from 'storybook/test';

import Accordion from '@/components/Accordion/Accordion';

const meta = {
  title: 'Core/Accordion',
  component: Accordion,
  tags: ['autodocs'],
  parameters: {
    renderer: 'react',
    layout: 'padded',
    a11y: { disable: false },
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/zsTOcot4CKA5nq2ihg0ZLi/Gather-Ground-Website?node-id=1647-392826',
    },
  },
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

const defaultItems = [
  {
    title: 'Where is Gather Ground located?',
    detail:
      'We are a family farm based in rural Iowa. Our heritage breed animals are raised on pasture year-round with room to roam.',
  },
  {
    title: 'How do I place an order?',
    detail:
      'You can browse and order through our online shop. We ship weekly to most of the continental US, and offer local pickup at the farm.',
  },
  {
    title: 'What breeds do you raise?',
    detail:
      'We raise Angus and Hereford cattle, Berkshire and Duroc pigs, Freedom Ranger chickens, and Bourbon Red turkeys — all heritage breeds known for their flavour.',
  },
];

export const Default: Story = {
  args: {
    items: defaultItems,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // First item question should be visible
    const firstQuestion = canvas.getByText('Where is Gather Ground located?');
    await expect(firstQuestion).toBeInTheDocument();

    // Answer should be hidden initially (Base UI removes content from DOM when closed)
    await expect(
      canvas.queryByText(
        'We are a family farm based in rural Iowa. Our heritage breed animals are raised on pasture year-round with room to roam.'
      )
    ).toBeFalsy();

    // Click the first trigger to open it
    const trigger = canvas.getByRole('button', {
      name: /where is gather ground located/i,
    });
    await userEvent.click(trigger);

    // Answer should now be visible
    await expect(
      canvas.getByText(
        'We are a family farm based in rural Iowa. Our heritage breed animals are raised on pasture year-round with room to roam.'
      )
    ).toBeVisible();
  },
};

export const SingleItem: Story = {
  args: {
    items: [
      {
        title: 'Is your farm certified organic?',
        detail:
          'We are not USDA certified organic, but we follow regenerative farming practices — no pesticides, no synthetic fertilisers, and no added hormones or antibiotics.',
      },
    ],
  },
};
