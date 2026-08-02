// @storybook-astro/framework does not export Meta/StoryObj — Astro stories are untyped by design.
import OrderLineItem from '@/components/OrderLineItem/OrderLineItem.astro';

const meta = {
  title: 'Account/Orders/OrderLineItem',
  component: OrderLineItem,
  tags: ['autodocs'],
  parameters: {
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
  args: {
    name: 'Artisan Coffee Blend',
    variantDescription: '250g / Medium Roast',
    imageUrl:
      'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=200',
    imageAlt: 'Artisan Coffee Blend',
    unitPriceFormatted: '£12.00',
    quantity: 2,
    lineTotalFormatted: '£24.00',
  },
};

export const LongName = {
  args: {
    name: 'Super Premium Single Origin Ethiopian Yirgacheffe Light Roast Whole Bean Coffee',
    variantDescription: '500g / Light Roast / Whole Bean',
    imageUrl:
      'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=200',
    imageAlt: 'Coffee bag',
    unitPriceFormatted: '£22.00',
    quantity: 1,
    lineTotalFormatted: '£22.00',
  },
};

export const NoImage = {
  args: {
    name: 'Mystery Gift Box',
    variantDescription: 'Standard',
    unitPriceFormatted: '£15.00',
    quantity: 3,
    lineTotalFormatted: '£45.00',
  },
};
