// @storybook-astro/framework does not export Meta/StoryObj — Astro stories are untyped by design.
// See: https://storybook-astro.org/writing-stories/
import OrderDetail from '@/components/OrderDetail/OrderDetail.astro';

const address = {
  firstName: 'Jane',
  lastName: 'Smith',
  line1: '12 Gather Street',
  city: 'London',
  postalCode: 'EC1A 1BB',
  country: 'GB',
};

const lineItems = [
  {
    id: 'li-1',
    name: 'Artisan Coffee Blend',
    variantDescription: '250g / Medium Roast',
    imageUrl:
      'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=200',
    imageAlt: 'Coffee bag',
    unitPriceFormatted: '£12.00',
    quantity: 2,
    lineTotalFormatted: '£24.00',
  },
  {
    id: 'li-2',
    name: 'Ceramic Pour-Over Set',
    variantDescription: 'White',
    unitPriceFormatted: '£35.00',
    quantity: 1,
    lineTotalFormatted: '£35.00',
  },
];

const meta = {
  title: 'Account/Orders/OrderDetail',
  component: OrderDetail,
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
  args: {
    orderNumber: '#1234',
    status: 'fulfilled',
    placedAt: '2026-07-15T00:00:00.000Z',
    shippingAddress: address,
    billingAddress: address,
    lineItems,
    subtotalFormatted: '£59.00',
    shippingCostFormatted: '£0.00',
    totalFormatted: '£59.00',
  },
};

export const Cancelled = {
  args: {
    orderNumber: '#1235',
    status: 'cancelled',
    placedAt: '2026-07-20T00:00:00.000Z',
    shippingAddress: address,
    billingAddress: address,
    lineItems: [lineItems[0]!],
    subtotalFormatted: '£12.00',
    shippingCostFormatted: '£3.99',
    totalFormatted: '£15.99',
  },
};

export const LargeOrder = {
  args: {
    orderNumber: '#1236',
    status: 'approved',
    placedAt: '2026-07-25T00:00:00.000Z',
    shippingAddress: address,
    billingAddress: { ...address, line2: 'Flat 4B' },
    lineItems: Array.from({ length: 10 }, (_, i) => ({
      id: `li-${i + 1}`,
      name: `Product ${i + 1}`,
      variantDescription: 'Standard',
      unitPriceFormatted: '£10.00',
      quantity: 1,
      lineTotalFormatted: '£10.00',
    })),
    subtotalFormatted: '£100.00',
    shippingCostFormatted: '£5.00',
    totalFormatted: '£105.00',
  },
};
