// Type stub for sanitize-html — @storybook-astro/framework ships raw TypeScript
// source that imports sanitize-html, but this project only installs sanitize-html
// itself (not @types/sanitize-html). Provide the minimal interface used by
// @storybook-astro/framework/src/lib/sanitization.ts so that import type { IOptions }
// resolves to a real interface rather than a bare ambient module.
declare module 'sanitize-html' {
  interface IOptions {
    [key: string]: unknown;
  }
  function sanitizeHtml(dirty: string, options?: IOptions): string;
  export { IOptions };
  export default sanitizeHtml;
}
