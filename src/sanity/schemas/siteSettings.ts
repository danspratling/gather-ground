import { defineField, defineType } from 'sanity';

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  groups: [
    { name: 'general', title: 'General', default: true },
    { name: 'navigation', title: 'Navigation' },
    { name: 'footer', title: 'Footer' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({
      name: 'siteName',
      title: 'Site name',
      type: 'string',
      description:
        'The name of the website — shown in the browser tab and search results.',
      validation: (r) => r.required(),
      group: 'general',
    }),
    defineField({
      name: 'siteDescription',
      title: 'Site description (optional)',
      type: 'string',
      description:
        'A short summary of the site. Not currently displayed publicly, but useful for reference.',
      group: 'general',
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      description:
        'The site logo shown in the header. Recommended: SVG or PNG with transparent background.',
      group: 'general',
    }),
    defineField({
      name: 'logoAlt',
      title: 'Logo description for screen readers',
      type: 'string',
      description:
        'Describes the logo for visitors who can\'t see it (e.g. "Gather Ground logo").',
      group: 'general',
    }),
    defineField({
      name: 'primaryNav',
      title: 'Main menu',
      type: 'array',
      description:
        'The navigation links shown in the header. Each item can optionally have a dropdown menu.',
      group: 'navigation',
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
      title: 'Header button text (optional)',
      type: 'string',
      description:
        'Text for the highlighted button in the top-right of the header. Leave blank to hide the button.',
      group: 'navigation',
    }),
    defineField({
      name: 'headerCtaLink',
      title: 'Header button link',
      type: 'link',
      description: 'Where the header button goes.',
      group: 'navigation',
    }),
    defineField({
      name: 'footerDescription',
      title: 'Footer description',
      type: 'string',
      description:
        'A short line of text shown at the top of the footer, below the logo.',
      group: 'footer',
    }),
    defineField({
      name: 'footerLinkGroups',
      title: 'Footer link columns',
      type: 'array',
      description:
        'Groups of links shown in the footer. Each group has a heading and a list of links.',
      group: 'footer',
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
      title: 'Social media links',
      type: 'array',
      description:
        'Links to your social media profiles — shown as icons in the footer.',
      group: 'footer',
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
                  { title: 'X (Twitter)', value: 'twitter' },
                  { title: 'LinkedIn', value: 'linkedin' },
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
              title: 'Label for screen readers',
              type: 'string',
              description:
                'Describes the link for visitors who can\'t see the icon (e.g. "Follow us on Instagram").',
              validation: (r) => r.required(),
            }),
          ],
        },
      ],
    }),
    defineField({
      name: 'copyrightText',
      title: 'Copyright text',
      type: 'string',
      description:
        'Shown at the very bottom of the footer (e.g. "© 2026 Gather Ground. All rights reserved.").',
      group: 'footer',
    }),
    defineField({
      name: 'footerLegalLinks',
      title: 'Footer legal links',
      type: 'array',
      description:
        'Small links at the bottom of the footer — typically Privacy Policy, Terms of Service, etc.',
      group: 'footer',
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
      title: 'Announcement banner',
      type: 'object',
      description:
        'A coloured strip shown above the header with a short message and optional button.',
      group: 'general',
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
          title: 'Colour style',
          type: 'string',
          description: 'Controls the background colour of the banner.',
          options: {
            list: [
              { title: 'Info (blue)', value: 'info' },
              { title: 'Warning (amber)', value: 'warning' },
              { title: 'Success (green)', value: 'success' },
            ],
          },
          initialValue: 'info',
        }),
      ],
    }),
    defineField({
      name: 'defaultMetaTitle',
      title: 'Default page title for search engines',
      type: 'string',
      description:
        'Used on pages that don\u2019t have their own title set. The site name is added automatically at the end.',
      group: 'seo',
    }),
    defineField({
      name: 'defaultMetaDescription',
      title: 'Default page description for search engines',
      type: 'text',
      rows: 3,
      description:
        'A short summary shown in Google results when a page doesn\u2019t have its own description. Keep it under 160 characters.',
      validation: (Rule) => Rule.max(160),
      group: 'seo',
    }),
    defineField({
      name: 'defaultOgImage',
      title: 'Default social sharing image',
      type: 'image',
      description:
        'The image shown when someone shares a link on Facebook, Twitter, LinkedIn, etc. — used when a page doesn\u2019t have its own image. Recommended: 1200 × 630 px.',
      group: 'seo',
    }),
  ],
});

export default null;
