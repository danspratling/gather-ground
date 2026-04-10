/**
 * Storyblok nestable blok schemas for components embeddable inside richtext fields.
 *
 * `callout` — highlighted aside block (colored background, richtext content)
 *
 * Push to Storyblok via the CLI:
 *   npm run sync-schemas
 */

export const calloutSchema = {
  name: 'callout',
  display_name: 'Callout',
  is_root: false,
  is_nestable: true,
  schema: {
    content: {
      type: 'richtext',
      display_name: 'Content',
      required: true,
      description: 'Text content displayed inside the callout block.',
    },
  },
} as const;

export default null;
