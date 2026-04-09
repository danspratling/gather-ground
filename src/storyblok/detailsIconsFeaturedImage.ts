/**
 * Storyblok component schema for DetailsIconsFeaturedImage.
 *
 * Push to Storyblok via the CLI:
 *   npx storyblok push-components --space 289911665285843
 */
export const detailsIconsFeaturedImageSchema = {
  name: 'details_icons_featured_image',
  display_name: 'Details — Icons with Featured Image',
  is_root: false,
  is_nestable: true,
  schema: {
    eyebrow: {
      type: 'text',
      display_name: 'Eyebrow',
      required: true,
    },
    heading: {
      type: 'text',
      display_name: 'Heading',
      required: true,
    },
    body: {
      type: 'textarea',
      display_name: 'Body',
      required: true,
    },
    features: {
      type: 'bloks',
      display_name: 'Features',
      restrict_components: true,
      component_whitelist: ['details_icon_feature'],
      maximum: 2,
    },
    image: {
      type: 'asset',
      display_name: 'Featured image',
      required: true,
      filetypes: ['images'],
    },
    dark: {
      type: 'boolean',
      display_name: 'Dark variant',
      default_value: false,
    },
  },
};

export const detailsIconFeatureSchema = {
  name: 'details_icon_feature',
  display_name: 'Details — Icon Feature',
  is_root: false,
  is_nestable: true,
  schema: {
    icon: {
      type: 'text',
      display_name: 'Icon name',
      description:
        'Name of icon from @untitledui-pro/icons/line (e.g. MessageChatCircle)',
    },
    heading: {
      type: 'text',
      display_name: 'Heading',
      required: true,
    },
    body: {
      type: 'textarea',
      display_name: 'Body',
      required: true,
    },
  },
};

export default null;
