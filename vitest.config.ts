import { defineConfig } from '@storybook-astro/framework/vitest';
import { react } from '@storybook-astro/framework/integrations';

export default defineConfig({
  integrations: [react({ include: ['**/components/**'] })],
  test: {
    environment: 'happy-dom',
    include: ['src/**/*.test.{ts,tsx}'],
  },
});
