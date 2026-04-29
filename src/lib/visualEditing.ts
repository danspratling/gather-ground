/**
 * Centralised visual-editing detection.
 *
 * Enabled when:
 *  1. PUBLIC_SANITY_VISUAL_EDITING_ENABLED is explicitly "true" (manual override), OR
 *  2. Running on the Astro dev server (import.meta.env.PROD === false), OR
 *  3. Running in a Vercel preview deployment (VERCEL_ENV === "preview").
 *
 * Production builds on Vercel (VERCEL_ENV === "production") are disabled by
 * default, unless PUBLIC_SANITY_VISUAL_EDITING_ENABLED is explicitly set to
 * "true". That keeps the public site from shipping stega strings or editing
 * overlays unless production visual editing is intentionally enabled.
 */
export const isVisualEditingEnabled =
  import.meta.env.PUBLIC_SANITY_VISUAL_EDITING_ENABLED === 'true' ||
  import.meta.env.PROD === false ||
  (typeof process !== 'undefined' && process.env.VERCEL_ENV === 'preview');

export default null;
