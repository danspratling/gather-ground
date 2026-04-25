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
  use: {
    baseURL,
    ignoreHTTPSErrors: true,
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    // In CI we build then serve the prerendered static output directly,
    // because the Vercel adapter doesn't support `astro preview`.
    // Studio (SSR) isn't exercised by Playwright tests.
    command: isCI
      ? 'npm run build && npx -y serve .vercel/output/static -l 4321 --no-port-switching'
      : 'npm run dev',
    url: baseURL,
    ignoreHTTPSErrors: true,
    reuseExistingServer: !isCI,
    timeout: 180_000,
  },
});
