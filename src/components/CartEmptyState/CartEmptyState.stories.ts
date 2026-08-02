import CartEmptyState from '@/components/CartEmptyState/CartEmptyState.astro';

const meta = {
  title: 'Commerce/CartEmptyState',
  component: CartEmptyState,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    a11y: { disable: false },
    chromatic: { viewports: [375, 1440] },
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/zsTOcot4CKA5nq2ihg0ZLi/Gather-Ground-Website?node-id=0-1',
    },
  },
};

export default meta;

export const Default = {
  args: {},
};
