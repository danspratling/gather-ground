import type { StorybookConfig } from '@storybook-astro/framework';
import tailwindcss from '@tailwindcss/vite';
import { react } from '@storybook-astro/framework/integrations';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const config: StorybookConfig = {
  stories: [
    '../src/stories/**/*.mdx',
    '../src/stories/**/*.stories.@(js|jsx|mjs|ts|tsx)',
  ],
  addons: [
    '@storybook/addon-docs',
    '@storybook/addon-a11y',
    '@storybook/addon-designs',
    '@chromatic-com/storybook',
  ],
  framework: {
    name: '@storybook-astro/framework',
    options: {
      integrations: [react({ include: ['**/components/**'], exclude: ['**/*.figma.*'] })],
    },
  },
  viteFinal: async (config) => {
    config.plugins = config.plugins ?? [];
    config.plugins.push(tailwindcss());
    config.resolve = config.resolve ?? {};
    config.resolve.alias = {
      ...(config.resolve.alias ?? {}),
      '@': path.resolve(__dirname, '../src'),
    };
    return config;
  },
};
export default config;
