/**
 * Storyblok content type schema for an Author.
 *
 * Authors are standalone stories that blog posts reference via the `author`
 * field. This means author info (name, photo, role) is entered once and
 * reused across all posts — editors never type it manually per post.
 *
 * Push to Storyblok via the CLI:
 *   npm run sync-schemas
 */
export const authorSchema = {
  name: 'author',
  display_name: 'Author',
  is_root: true,
  is_nestable: false,
  schema: {
    name: {
      type: 'text',
      display_name: 'Name',
      required: true,
    },
    avatar: {
      type: 'asset',
      display_name: 'Photo',
      required: true,
      filetypes: ['images'],
    },
    role: {
      type: 'text',
      display_name: 'Role / title',
    },
  },
} as const;

export default null;
