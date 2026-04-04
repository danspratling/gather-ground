import { expect, within } from 'storybook/test';

// @ts-expect-error — .astro files have no TypeScript declarations
import AvatarGroup from './AvatarGroup.astro';

const PLACEHOLDER = 'https://i.pravatar.cc/150?img=1';
const PLACEHOLDER_2 = 'https://i.pravatar.cc/150?img=2';
const PLACEHOLDER_3 = 'https://i.pravatar.cc/150?img=3';

export default {
  title: 'Components/AvatarGroup',
  component: AvatarGroup,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    a11y: { disable: false },
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/zsTOcot4CKA5nq2ihg0ZLi/Gather-Ground-Website?node-id=18591-59485',
    },
  },
};

export const TwoAvatars = {
  args: {
    avatars: [
      { src: PLACEHOLDER, alt: 'Jane Smith' },
      { src: PLACEHOLDER_2, alt: 'John Doe' },
    ],
    size: 'xl' as const,
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement);
    const imgs = canvas.getAllByRole('img');
    await expect(imgs).toHaveLength(2);
    for (const img of imgs) {
      await expect(img.getAttribute('alt')).toBeTruthy();
    }
  },
};

export const ThreeAvatars = {
  args: {
    avatars: [
      { src: PLACEHOLDER, alt: 'Jane Smith' },
      { src: PLACEHOLDER_2, alt: 'John Doe' },
      { src: PLACEHOLDER_3, alt: 'Alice Brown' },
    ],
    size: 'xl' as const,
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement);
    const imgs = canvas.getAllByRole('img');
    await expect(imgs).toHaveLength(3);
  },
};
