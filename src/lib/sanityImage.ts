import imageUrlBuilder from '@sanity/image-url';
import { sanityClient } from 'sanity:client';

const builder = imageUrlBuilder(sanityClient);

/**
 * Build a Sanity image URL from an image reference.
 * Usage: sanityImageUrl(image).width(800).url()
 */
export function sanityImageUrl(source: { asset: { _ref: string } }) {
  return builder.image(source);
}

/**
 * Get a plain URL string from a Sanity image reference.
 * Returns empty string if no image is provided.
 */
export function sanityImageSrc(
  source: { asset?: { _ref: string } } | undefined
): string {
  if (!source?.asset?._ref) return '';
  return builder.image(source).auto('format').url();
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
