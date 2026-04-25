import { createImageUrlBuilder } from '@sanity/image-url';
import { stegaClean } from '@sanity/client/stega';
import { sanityClient } from 'sanity:client';

const builder = createImageUrlBuilder(sanityClient);

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
  source: { asset?: { _ref?: string; _id?: string } } | undefined
): string {
  const cleaned = stegaClean(source) as
    | { asset?: { _ref?: string; _id?: string } }
    | undefined;
  const id = cleaned?.asset?._ref ?? cleaned?.asset?._id;
  if (!id) return '';
  return builder
    .image(cleaned as { asset: { _ref: string } })
    .auto('format')
    .url();
}

/**
 * Get the alt text from a Sanity image field.
 * Reads the sibling `alt` field on the image object
 * (defined on each image-using schema). Falls back to the
 * provided string if no alt is set.
 */
export function sanityImageAlt(
  source: { alt?: string } | undefined,
  fallback = ''
): string {
  return source?.alt || fallback;
}

export default null;
