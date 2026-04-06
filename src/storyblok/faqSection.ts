/**
 * Storyblok component schema for FaqSection.
 *
 * Push to Storyblok via the CLI:
 *   npx storyblok push-components --space 289911665285843
 */
export const faqSectionSchema = {
  name: 'faq_section',
  display_name: 'FAQ Section',
  is_root: false,
  is_nestable: true,
  schema: {
    heading: {
      type: 'text',
      display_name: 'Heading',
      required: true,
    },
    sub_copy: {
      type: 'textarea',
      display_name: 'Sub copy',
    },
    faqs: {
      type: 'options',
      display_name: 'FAQs',
      source: 'internal_stories',
      allow_target_types: ['story'],
      filter_content_type: ['faq'],
      entry_appearance: 'card',
      allow_advanced_search: true,
    },
    cta: {
      type: 'bloks',
      display_name: 'Call to action block',
      restrict_components: true,
      component_whitelist: ['cta_block'],
      maximum: 1,
    },
  },
} as const;
