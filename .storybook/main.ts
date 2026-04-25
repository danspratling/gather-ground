import type { StorybookConfig } from '@storybook-astro/framework';
import tailwindcss from '@tailwindcss/vite';
import { react } from '@storybook-astro/framework/integrations';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const config: StorybookConfig = {
  stories: [
    '../src/stories/**/*.mdx',
    '../src/components/**/*.stories.@(js|jsx|mjs|ts|tsx)',
  ],
  addons: [
    '@storybook/addon-docs',
    '@storybook/addon-a11y',
    '@storybook/addon-designs',
    '@chromatic-com/storybook',
    '@storybook/addon-vitest',
  ],
  framework: {
    name: '@storybook-astro/framework',
    options: {
      // Static mode pre-renders all stories to a JSON file at build time.
      // This is required for Chromatic (no live Astro server in CI).
      // Server mode (default) is used locally via `npm run storybook`.
      renderMode:
        process.env.IS_STORYBOOK_BUILD === 'true' ? 'static' : 'server',
      integrations: [react({ include: ['**/components/**'] })],
      sanitization: {
        sanitizeHtml: {
          allowedTags: [
            'svg',
            'path',
            'circle',
            'rect',
            'line',
            'polyline',
            'polygon',
          ],
          allowedAttributes: {
            svg: [
              'width',
              'height',
              'viewBox',
              'fill',
              'stroke',
              'stroke-width',
              'stroke-linecap',
              'stroke-linejoin',
              'aria-hidden',
              'class',
              'color',
            ],
            path: [
              'd',
              'stroke',
              'stroke-width',
              'stroke-linecap',
              'stroke-linejoin',
              'fill',
            ],
            '*': ['class', 'aria-hidden'],
          },
        },
      },
    },
  },
  viteFinal: async (config) => {
    config.plugins = config.plugins ?? [];
    config.plugins.push(tailwindcss());
    // Stub the `sanity:client` virtual module — provided by @sanity/astro at
    // runtime but not available inside Storybook. Components that use it
    // (e.g. via sanityImage helpers) work in stories with hardcoded mock data.
    config.plugins.push({
      name: 'stub-sanity-client',
      resolveId(id) {
        if (id === 'sanity:client') return '\0sanity:client-stub';
        return null;
      },
      load(id) {
        if (id === '\0sanity:client-stub') {
          return `export const sanityClient = { config: () => ({ projectId: 'stub', dataset: 'stub' }) };`;
        }
        return null;
      },
    });
    config.resolve = config.resolve ?? {};
    config.resolve.alias = {
      ...(config.resolve.alias ?? {}),
      '@': path.resolve(__dirname, '../src'),
    };
    return config;
  },
};
export default config;
