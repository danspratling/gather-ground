import { defineConfig } from 'vitest/config';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Root Vitest config — two projects:
//
//  storybook-astro  Astro component stories via renderStory in happy-dom + axe-core.
//                   Runs in CI. Fast — no browser required.
//
//  storybook        ALL stories in real Chromium via Playwright.
//                   Powers the Storybook UI testing widget locally.
//                   NOT run in CI — Chromatic handles interaction + a11y
//                   tests in its cloud (see ADR-019). Run locally with
//                   `npm run test-storybook:react` for pre-push validation.
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
