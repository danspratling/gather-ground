/**
 * Storyblok component schemas for Content section variants.
 *
 * Push to Storyblok via the CLI:
 *   npx storyblok push-components --space 289911665285843
 */
export const contentSimpleSchema = {
  name: 'content_simple',
  display_name: 'Content — Simple',
  is_root: false,
  is_nestable: true,
  schema: {
    icon: {
      type: 'text',
      display_name: 'Icon name',
      description:
        'Name of icon from @untitledui-pro/icons/line (e.g. ZapFast)',
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
      component_whitelist: ['content_feature_item'],
    },
    dark: {
      type: 'boolean',
      display_name: 'Dark variant',
      default_value: false,
    },
  },
};

export const contentFeatureItemSchema = {
  name: 'content_feature_item',
  display_name: 'Content — Feature Item',
  is_root: false,
  is_nestable: true,
  schema: {
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

export const contentAlternatingSchema = {
  name: 'content_alternating',
  display_name: 'Content — Alternating',
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
    checklist_items: {
      type: 'textarea',
      display_name: 'Checklist items',
      description: 'One item per line. Each line becomes a checklist entry.',
    },
    image: {
      type: 'asset',
      display_name: 'Image',
      required: true,
      filetypes: ['images'],
    },
    image_position: {
      type: 'option',
      display_name: 'Image position',
      default_value: 'right',
      options: [
        { value: 'left', name: 'Left' },
        { value: 'right', name: 'Right' },
      ],
    },
    dark: {
      type: 'boolean',
      display_name: 'Dark variant',
      default_value: false,
    },
  },
};

export const contentIconsFeaturedImageSchema = {
  name: 'content_icons_featured_image',
  display_name: 'Content — Icons with Featured Image',
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
      component_whitelist: ['content_icon_feature'],
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

export const contentIconFeatureSchema = {
  name: 'content_icon_feature',
  display_name: 'Content — Icon Feature',
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
