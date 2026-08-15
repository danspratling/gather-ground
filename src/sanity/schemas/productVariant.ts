import { defineType, defineField, defineArrayMember } from 'sanity';
import { commerceFieldHidden } from '../../lib/commerce/featureFlag';
import { OptionValueInput } from '../components/OptionValueInput';

export const productVariant = defineType({
  name: 'productVariant',
  title: 'Product Variant',
  type: 'document',
  fields: [
    defineField({
      name: 'sku',
      title: 'SKU',
      type: 'string',
      description:
        'Unique product SKU — must match Commerce Layer sku_code. Pattern: GG-{product}-{variant}',
      validation: (Rule) =>
        Rule.required()
          .regex(/^GG-[a-z0-9-]+-[a-z0-9-]+$/, {
            name: 'SKU pattern',
            invert: false,
          })
          .error(
            'SKU must match pattern GG-{product}-{variant} (e.g. GG-honey-jar-250g)'
          ),
    }),
    defineField({
      name: 'parentProduct',
      title: 'Parent product',
      type: 'reference',
      to: [{ type: 'products' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'optionValues',
      title: 'Option values',
      type: 'array',
      description:
        'The specific option selections for this variant (e.g. Size: 250g, Flavour: Original)',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'option',
              title: 'Option',
              type: 'reference',
              to: [{ type: 'productOption' }],
              description:
                'Select an existing option or type to create a new one.',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'value',
              title: 'Value',
              type: 'string',
              description: 'e.g. 250g, Smoked, Red',
              components: { input: OptionValueInput },
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: { title: 'option.name', subtitle: 'value' },
          },
        }),
      ],
    }),
    defineField({
      name: 'price',
      title: 'Price',
      type: 'object',
      hidden: commerceFieldHidden(),
      fields: [
        defineField({
          name: 'amount',
          title: 'Amount (pence)',
          type: 'number',
          description: 'Price in smallest currency unit (e.g. 1999 = £19.99)',
        }),
        defineField({
          name: 'currency',
          title: 'Currency',
          type: 'string',
          initialValue: 'GBP',
        }),
      ],
    }),
    defineField({
      name: 'compareAtPrice',
      title: 'Compare-at price (optional)',
      type: 'object',
      hidden: commerceFieldHidden(),
      fields: [
        defineField({
          name: 'amount',
          title: 'Amount (pence)',
          type: 'number',
        }),
        defineField({
          name: 'currency',
          title: 'Currency',
          type: 'string',
          initialValue: 'GBP',
        }),
      ],
    }),
    defineField({
      name: 'taxCategory',
      title: 'Tax category',
      type: 'string',
      hidden: commerceFieldHidden(),
      options: {
        list: [
          { title: 'UK Standard 20%', value: 'vat-uk-20' },
          { title: 'Zero-rated', value: 'vat-uk-0' },
        ],
        layout: 'radio',
      },
      initialValue: 'vat-uk-20',
    }),
    defineField({
      name: 'weight',
      title: 'Weight (grams)',
      type: 'number',
      hidden: commerceFieldHidden(),
      description: 'Used for shipping calculation.',
    }),
    defineField({
      name: 'dimensions',
      title: 'Dimensions',
      type: 'object',
      hidden: commerceFieldHidden(),
      fields: [
        defineField({ name: 'length', title: 'Length (cm)', type: 'number' }),
        defineField({ name: 'width', title: 'Width (cm)', type: 'number' }),
        defineField({ name: 'height', title: 'Height (cm)', type: 'number' }),
      ],
    }),
    defineField({
      name: 'inventoryStatus',
      title: 'Inventory status',
      type: 'string',
      // RF-06: readOnly + hidden so editors cannot manually set this
      readOnly: true,
      hidden: true,
      description:
        'Synced automatically from Commerce Layer. Do not edit manually.',
      options: {
        list: [
          { title: 'In stock', value: 'in_stock' },
          { title: 'Low stock', value: 'low_stock' },
          { title: 'Out of stock', value: 'out_of_stock' },
        ],
      },
    }),
    defineField({
      name: 'images',
      title: 'Variant images (optional)',
      type: 'array',
      description:
        'Override images for this specific variant. Falls back to parent product images.',
      of: [
        defineArrayMember({
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({ name: 'alt', title: 'Alt text', type: 'string' }),
          ],
        }),
      ],
    }),
  ],
  preview: {
    select: { title: 'sku', subtitle: 'parentProduct.title' },
    prepare: ({ title, subtitle }) => ({ title, subtitle }),
  },
});

export default null;
