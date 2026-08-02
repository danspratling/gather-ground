// @storybook-astro/framework does not export Meta/StoryObj — Astro stories are untyped by design.
// See: https://storybook-astro.org/writing-stories/

import ProductDetail from '@/components/ProductDetail/ProductDetail.astro';

const meta = {
  title: 'Commerce/Product Detail',
  component: ProductDetail,
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

// --- Shared mock data ---

const mockImages = [
  {
    url: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=800&h=800&fit=crop',
    altText: 'Free-range pork belly',
  },
];

const sizeOption = {
  id: 'opt-size',
  name: 'Size',
  values: [
    { id: 'val-500g', name: '500g' },
    { id: 'val-1kg', name: '1kg' },
  ],
};

const cutOption = {
  id: 'opt-cut',
  name: 'Cut',
  values: [
    { id: 'val-belly', name: 'Belly' },
    { id: 'val-loin', name: 'Loin' },
  ],
};

const gbpPrice = (pence: number, label: string) => ({
  amount: pence,
  currency: 'GBP',
  formatted: `£${label}`,
});

const allVariants = [
  {
    id: 'var-500g-belly',
    name: '500g / Belly',
    sku: 'PORK-500G-BELLY',
    price: gbpPrice(899, '8.99'),
    selectedOptions: { Size: '500g', Cut: 'Belly' },
    inventoryStatus: 'in_stock' as const,
  },
  {
    id: 'var-500g-loin',
    name: '500g / Loin',
    sku: 'PORK-500G-LOIN',
    price: gbpPrice(999, '9.99'),
    selectedOptions: { Size: '500g', Cut: 'Loin' },
    inventoryStatus: 'in_stock' as const,
  },
  {
    id: 'var-1kg-belly',
    name: '1kg / Belly',
    sku: 'PORK-1KG-BELLY',
    price: gbpPrice(1599, '15.99'),
    selectedOptions: { Size: '1kg', Cut: 'Belly' },
    inventoryStatus: 'in_stock' as const,
  },
  {
    id: 'var-1kg-loin',
    name: '1kg / Loin',
    sku: 'PORK-1KG-LOIN',
    price: gbpPrice(1799, '17.99'),
    selectedOptions: { Size: '1kg', Cut: 'Loin' },
    inventoryStatus: 'low_stock' as const,
  },
];

const oosVariants = allVariants.map((v) => ({
  ...v,
  inventoryStatus: 'out_of_stock' as const,
}));

// --- Stories ---

export const Default = {
  args: {
    title: 'Free-Range Pork Belly',
    description:
      'Pasture-raised on our family farm in the Cotswolds. Rich flavour, natural fat marbling, and exceptional tenderness — perfect for slow roasting or braising.',
    images: mockImages,
    options: [sizeOption, cutOption],
    variants: allVariants,
    selectedVariantId: 'var-500g-belly',
  },
};

export const OutOfStock = {
  args: {
    title: 'Free-Range Pork Belly',
    description:
      'Currently out of season — check back soon for our next batch.',
    images: mockImages,
    options: [sizeOption, cutOption],
    variants: oosVariants,
    selectedVariantId: 'var-500g-belly',
  },
};

export const SingleVariant = {
  args: {
    title: 'Heritage Beef Tallow',
    description: 'Traditional rendered beef fat, great for high-heat cooking.',
    images: mockImages,
    options: [],
    variants: [
      {
        id: 'var-tallow-single',
        name: '350g',
        sku: 'BEEF-TALLOW-350G',
        price: gbpPrice(699, '6.99'),
        selectedOptions: {},
        inventoryStatus: 'in_stock' as const,
      },
    ],
  },
};

export const NoImage = {
  args: {
    title: 'Seasonal Lamb Box',
    description: 'A curated selection of our best lamb cuts.',
    images: [],
    options: [sizeOption],
    variants: [
      {
        id: 'var-lamb-small',
        name: 'Small Box',
        sku: 'LAMB-BOX-SM',
        price: gbpPrice(3499, '34.99'),
        selectedOptions: { Size: '500g' },
        inventoryStatus: 'in_stock' as const,
      },
      {
        id: 'var-lamb-large',
        name: 'Large Box',
        sku: 'LAMB-BOX-LG',
        price: gbpPrice(5999, '59.99'),
        selectedOptions: { Size: '1kg' },
        inventoryStatus: 'in_stock' as const,
      },
    ],
  },
};
