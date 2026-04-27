import { defineField, defineType } from 'sanity';

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'siteName',
      title: 'Site Name',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'siteDescription',
      title: 'Site Description',
      type: 'string',
    }),
    defineField({ name: 'logo', title: 'Logo', type: 'image' }),
    defineField({ name: 'logoAlt', title: 'Logo Alt Text', type: 'string' }),
    defineField({
      name: 'primaryNav',
      title: 'Primary Navigation',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'label',
              title: 'Label',
              type: 'string',
              validation: (r) => r.required(),
            }),
            defineField({
              name: 'link',
              title: 'Link',
              type: 'link',
            }),
            defineField({
              name: 'menu',
              title: 'Dropdown items',
              type: 'array',
              of: [
                {
                  type: 'object',
                  fields: [
                    defineField({
                      name: 'label',
                      title: 'Label',
                      type: 'string',
                      validation: (r) => r.required(),
                    }),
                    defineField({
                      name: 'link',
                      title: 'Link',
                      type: 'link',
                      validation: (r) => r.required(),
                    }),
                    defineField({
                      name: 'description',
                      title: 'Description',
                      type: 'string',
                    }),
                  ],
                },
              ],
            }),
          ],
        },
      ],
    }),
    defineField({
      name: 'headerCtaLabel',
      title: 'Header CTA Label',
      type: 'string',
    }),
    defineField({
      name: 'headerCtaLink',
      title: 'Header CTA Link',
      type: 'link',
    }),
    defineField({
      name: 'footerDescription',
      title: 'Footer Description',
      type: 'string',
    }),
    defineField({
      name: 'footerLinkGroups',
      title: 'Footer Link Groups',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'heading',
              title: 'Heading',
              type: 'string',
              validation: (r) => r.required(),
            }),
            defineField({
              name: 'links',
              title: 'Links',
              type: 'array',
              of: [
                {
                  type: 'object',
                  fields: [
                    defineField({
                      name: 'label',
                      title: 'Label',
                      type: 'string',
                      validation: (r) => r.required(),
                    }),
                    defineField({
                      name: 'link',
                      title: 'Link',
                      type: 'link',
                      validation: (r) => r.required(),
                    }),
                  ],
                },
              ],
            }),
          ],
        },
      ],
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social Links',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'platform',
              title: 'Platform',
              type: 'string',
              options: {
                list: [
                  { title: 'Instagram', value: 'instagram' },
                  { title: 'Facebook', value: 'facebook' },
                  { title: 'TikTok', value: 'tiktok' },
                  { title: 'YouTube', value: 'youtube' },
                  { title: 'X (Twitter)', value: 'x' },
                ],
              },
              validation: (r) => r.required(),
            }),
            defineField({
              name: 'url',
              title: 'URL',
              type: 'url',
              validation: (r) => r.required(),
            }),
            defineField({
              name: 'label',
              title: 'Accessible label',
              type: 'string',
              validation: (r) => r.required(),
            }),
          ],
        },
      ],
    }),
    defineField({
      name: 'copyrightText',
      title: 'Copyright Text',
      type: 'string',
    }),
    defineField({
      name: 'footerLegalLinks',
      title: 'Footer Legal Links',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'label',
              title: 'Label',
              type: 'string',
              validation: (r) => r.required(),
            }),
            defineField({
              name: 'link',
              title: 'Link',
              type: 'link',
              validation: (r) => r.required(),
            }),
          ],
        },
      ],
    }),
    defineField({
      name: 'announcementBanner',
      title: 'Announcement Banner',
      type: 'object',
      fields: [
        defineField({
          name: 'enabled',
          title: 'Show banner',
          type: 'boolean',
          initialValue: false,
        }),
        defineField({ name: 'message', title: 'Message', type: 'string' }),
        defineField({
          name: 'ctaLabel',
          title: 'Button label',
          type: 'string',
        }),
        defineField({ name: 'ctaLink', title: 'Button link', type: 'link' }),
        defineField({
          name: 'variant',
          title: 'Style',
          type: 'string',
          options: {
            list: [
              { title: 'Info', value: 'info' },
              { title: 'Warning', value: 'warning' },
              { title: 'Success', value: 'success' },
            ],
          },
          initialValue: 'info',
        }),
      ],
    }),
  ],
});
