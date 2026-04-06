/**
 * Storyblok content type schema for the homepage (generic Page).
 *
 * This is a root content type — create it in Storyblok as a Content Type
 * (is_root: true, is_nestable: false) and add a `body` Blocks field
 * whitelisting the section components listed below.
 *
 * Push to Storyblok via the CLI:
 *   npx storyblok push-components --space 289911665285843
 */
export const pageSchema = {
  name: 'page',
  display_name: 'Page',
  is_root: true,
  is_nestable: false,
  schema: {
    body: {
      type: 'bloks',
      display_name: 'Body',
      restrict_components: true,
      component_whitelist: [
        'hero_section',
        'products_section_cards',
        'products_section_carousel',
        'testimonials_section',
        'faq_section',
        'blog_section',
      ],
    },
  },
} as const;

export default null;
