// @ts-expect-error — .astro files have no TypeScript declarations
import FeaturedPost from './FeaturedPost.astro';
import type { FeaturedPostProps } from './FeaturedPost.types';

export default {
  title: 'Components/FeaturedPost',
  component: FeaturedPost,
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/zsTOcot4CKA5nq2ihg0ZLi/Gather-Ground-Website?node-id=1624-472083',
    },
    chromatic: { viewports: [375, 1440] },
  },
} satisfies Record<string, unknown>;

const mockPost: FeaturedPostProps = {
  image:
    'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=824&h=412&fit=crop',
  imageAlt: 'Abstract purple and blue art',
  categories: ['New feature', 'Design'],
  title: 'UX review presentations',
  excerpt:
    'How do you create compelling presentations that wow your colleagues and impress your managers?',
  href: '/blog/ux-review-presentations',
  authorName: 'Olivia Rhye',
  authorImage:
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face',
  authorImageAlt: 'Olivia Rhye',
  date: '20 Jan 2025',
};

export const Default = { args: mockPost };
