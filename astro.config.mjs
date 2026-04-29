import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import sanity from '@sanity/astro';
import vercel from '@astrojs/vercel';
import { loadEnv } from 'vite';
import path from 'node:path';
import mkcert from 'vite-plugin-mkcert';

import sitemap from '@astrojs/sitemap';

const env = loadEnv('', process.cwd(), [
  'SANITY',
  'PUBLIC_SANITY',
  'PUBLIC_STUDIO',
]);

// Vercel sets VERCEL_ENV to 'production', 'preview', or 'development'.
// Only preview deployments use SSR (for live Studio + visual editing).
// Everything else (production, CI, local dev server) uses static output.
// The local `astro dev` command always SSR's regardless of this setting.
const isPreview = process.env.VERCEL_ENV === 'preview';
const isProduction = process.env.VERCEL_ENV === 'production';
// CI sets CI=true; production Vercel sets VERCEL_ENV=production.
// Mount Studio everywhere except production builds and CI.
const mountStudio = !isProduction && !process.env.CI;

// https://astro.build/config
export default defineConfig({
  site: 'https://gatherground.co.uk',
  output: isPreview ? 'server' : 'static',
  adapter: vercel(),
  vite: {
    plugins: [tailwindcss(), mkcert()],
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
      useCdn: isProduction, // CDN for production static, live API elsewhere
      ...(mountStudio ? { studioBasePath: '/studio' } : {}),
    }),
    sitemap({
      filter: (page) => !page.includes('/studio'),
    }),
  ],
});
