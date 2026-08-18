import { defineConfig, devices } from '@playwright/test';

const isCI = !!process.env.CI;
const baseURL = isCI ? 'http://localhost:4321' : 'https://localhost:4321';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  workers: isCI ? 1 : undefined,
  reporter: 'html',
  timeout: 30_000,
  use: {
    baseURL,
    ignoreHTTPSErrors: true,
    trace: 'on-first-retry',
    actionTimeout: 10_000,
    navigationTimeout: 30_000,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    // Both CI and local use the dev server.
    // CI skips mkcert (see astro.config.mjs) so it runs plain HTTP.
    command: 'npm run dev -- --port 4321 --host localhost',
    url: baseURL,
    ignoreHTTPSErrors: true,
    reuseExistingServer: !isCI,
    timeout: 180_000,
  },
});
