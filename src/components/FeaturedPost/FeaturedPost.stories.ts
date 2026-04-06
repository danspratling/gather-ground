import type { Meta } from '@storybook/types';
import type { FeaturedPostProps } from './FeaturedPost.types';

export default {
  title: 'Components/FeaturedPost',
  component: 'FeaturedPost',
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/zsTOcot4CKA5nq2ihg0ZLi/Gather-Ground-Website?node-id=1624-472083',
    },
    chromatic: { viewports: [375, 1440] },
  },
} satisfies Meta;

const mockPost: FeaturedPostProps = {
  image: 'https://placehold.co/824x412',
  imageAlt: 'Abstract purple and blue art',
  categories: ['New feature', 'Design'],
  title: 'UX review presentations',
  excerpt:
    'How do you create compelling presentations that wow your colleagues and impress your managers?',
  href: '/blog/ux-review-presentations',
  authorName: 'Olivia Rhye',
  authorImage: 'https://placehold.co/40x40',
  authorImageAlt: 'Olivia Rhye',
  date: '20 Jan 2025',
};

export const Default = { args: mockPost };
