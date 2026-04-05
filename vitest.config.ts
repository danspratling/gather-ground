import { defineConfig } from 'vitest/config';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Root Vitest config — two projects run together via `vitest run`:
//
//  storybook-astro  Astro component stories via renderStory in happy-dom + axe-core
//                   (src/stories.test.ts — see vitest.astro.config.ts)
//
//  storybook        ALL stories in real Chromium via Playwright.
//                   Play functions, a11y addon, and React island stories are
//                   covered here. This project is what the Storybook UI uses.
export default defineConfig({
  test: {
    projects: [
      './vitest.astro.config.ts',
      {
        extends: true,
        plugins: [
          storybookTest({
            configDir: path.join(__dirname, '.storybook'),
            storybookScript: 'npm run storybook',
            storybookUrl: 'http://localhost:6006',
          }),
        ],
        optimizeDeps: {
          include: [
            '@storybook/react/entry-preview',
            '@storybook-astro/framework/renderer/renderer-dev.ts',
          ],
        },
        resolve: {
          alias: {
            '@': path.resolve(__dirname, 'src'),
          },
        },
        test: {
          name: 'storybook',
          isolate: false,
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({}),
            instances: [{ browser: 'chromium' }],
          },
          setupFiles: ['.storybook/vitest.setup.ts'],
        },
      },
    ],
  },
});
