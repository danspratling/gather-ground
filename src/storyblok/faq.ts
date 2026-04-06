/**
 * Storyblok content type schema for a single FAQ entry.
 *
 * Stored as standalone stories (is_root: true) so they can be reused
 * across multiple sections. Referenced via the References field on
 * faq_section.
 *
 * Push to Storyblok via the CLI:
 *   npm run sync-schemas
 */
export const faqSchema = {
  name: 'faq',
  display_name: 'FAQ',
  is_root: true,
  is_nestable: false,
  schema: {
    title: {
      type: 'text',
      display_name: 'Question',
      required: true,
    },
    detail: {
      type: 'textarea',
      display_name: 'Answer',
      required: true,
    },
  },
} as const;

export default null;
