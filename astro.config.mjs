import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import { storyblok } from '@storyblok/astro';
import { loadEnv } from 'vite';
import path from 'node:path';

const env = loadEnv('', process.cwd(), 'STORYBLOK');

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve('./src'),
      },
    },
  },
  integrations: [
    react(),
    storyblok({
      accessToken: env.STORYBLOK_TOKEN,
      bridge: true,
    }),
  ],
});
