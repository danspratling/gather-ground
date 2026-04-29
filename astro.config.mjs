import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import sanity from '@sanity/astro';
import vercel from '@astrojs/vercel';
import { loadEnv } from 'vite';
import path from 'node:path';
import mkcert from 'vite-plugin-mkcert';

import sitemap from '@astrojs/sitemap';

const env = loadEnv('', process.cwd(), ['SANITY', 'PUBLIC_SANITY']);

// https://astro.build/config
export default defineConfig({
  site: 'https://gatherground.co.uk',
  output: 'server',
  adapter: vercel(),
  vite: {
    plugins: [tailwindcss(), ...(process.env.CI ? [] : [mkcert()])],
    resolve: {
      alias: {
        '@': path.resolve('./src'),
      },
    },
    optimizeDeps: {
      include: [
        'sanity',
        'sanity/structure',
        'sanity/presentation',
        '@sanity/visual-editing',
        // Pre-bundle every lodash submodule so CJS→ESM interop works for
        // transitive imports like `lodash/groupBy.js`, `lodash/isObject.js`, etc.
        // used inside @sanity/visual-editing's createOptimisticStore.
        'lodash',
        'lodash/*.js',
        'react',
        'react-dom',
        'react-dom/client',
        'react/compiler-runtime',
      ],
    },
  },
  integrations: [
    react(),
    sanity({
      projectId: env.SANITY_PROJECT_ID,
      dataset: env.SANITY_DATASET || 'production',
      useCdn: false,
      studioBasePath: '/studio',
    }),
    sitemap({
      filter: (page) => !page.includes('/studio'),
    }),
  ],
});
