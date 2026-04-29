import { createImageUrlBuilder } from '@sanity/image-url';
import { stegaClean } from '@sanity/client/stega';

// Read project config directly from env rather than importing `sanity:client`,
// which is a virtual module provided by @sanity/astro at runtime and not
// available in Storybook builds.
const projectId =
  import.meta.env.SANITY_PROJECT_ID ||
  import.meta.env.PUBLIC_SANITY_PROJECT_ID ||
  'placeholder';
const dataset =
  import.meta.env.SANITY_DATASET ||
  import.meta.env.PUBLIC_SANITY_DATASET ||
  'production';

const builder = createImageUrlBuilder({ projectId, dataset });

/**
 * Build a Sanity image URL from an image reference.
 * Usage: sanityImageUrl(image).width(800).url()
 */
export function sanityImageUrl(source: {
  asset: { _ref?: string; _id?: string };
}) {
  return builder.image(source);
}

/**
 * Get a plain URL string from a Sanity image reference.
 * Returns empty string if no image is provided.
 *
 * Accepts both raw image refs (`asset._ref`) and dereferenced
 * assets (`asset._id`) — GROQ projections using `asset->` resolve
 * to the latter.
 */
export function sanityImageSrc(
  source: { asset?: { _ref?: string; _id?: string } } | undefined,
  options?: { width?: number; height?: number; quality?: number }
): string {
  const cleaned = stegaClean(source) as
    | { asset?: { _ref?: string; _id?: string } }
    | undefined;
  const id = cleaned?.asset?._ref ?? cleaned?.asset?._id;
  if (!id) return '';
  let urlBuilder = builder
    .image(cleaned as { asset: { _ref: string } })
    .auto('format');
  if (options?.width) urlBuilder = urlBuilder.width(options.width);
  if (options?.height) urlBuilder = urlBuilder.height(options.height);
  if (options?.quality) urlBuilder = urlBuilder.quality(options.quality);
  return urlBuilder.url();
}

/**
 * Get the alt text from a Sanity image field.
 * Sanity stores alt text on the asset metadata or as a sibling field.
 */
export function sanityImageAlt(
  source: { alt?: string } | undefined,
  fallback = ''
): string {
  return source?.alt || fallback;
}

export default null;
