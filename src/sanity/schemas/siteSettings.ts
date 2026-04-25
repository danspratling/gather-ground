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
              type: 'string',
              validation: (r) => r.required(),
            }),
            defineField({ name: 'href', type: 'string' }),
            defineField({
              name: 'menu',
              type: 'array',
              of: [
                {
                  type: 'object',
                  fields: [
                    defineField({
                      name: 'label',
                      type: 'string',
                      validation: (r) => r.required(),
                    }),
                    defineField({
                      name: 'href',
                      type: 'string',
                      validation: (r) => r.required(),
                    }),
                    defineField({ name: 'description', type: 'string' }),
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
      name: 'headerCtaHref',
      title: 'Header CTA URL',
      type: 'string',
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
              type: 'string',
              validation: (r) => r.required(),
            }),
            defineField({
              name: 'links',
              type: 'array',
              of: [
                {
                  type: 'object',
                  fields: [
                    defineField({
                      name: 'label',
                      type: 'string',
                      validation: (r) => r.required(),
                    }),
                    defineField({
                      name: 'href',
                      type: 'string',
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
              type: 'string',
              options: {
                list: ['instagram', 'facebook', 'tiktok', 'youtube', 'x'],
              },
              validation: (r) => r.required(),
            }),
            defineField({
              name: 'href',
              type: 'url',
              validation: (r) => r.required(),
            }),
            defineField({
              name: 'label',
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
              type: 'string',
              validation: (r) => r.required(),
            }),
            defineField({
              name: 'href',
              type: 'string',
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
          type: 'boolean',
          initialValue: false,
        }),
        defineField({ name: 'message', type: 'string' }),
        defineField({ name: 'ctaLabel', type: 'string' }),
        defineField({ name: 'ctaHref', type: 'string' }),
        defineField({
          name: 'variant',
          type: 'string',
          options: { list: ['info', 'warning', 'success'] },
          initialValue: 'info',
        }),
      ],
    }),
  ],
});
