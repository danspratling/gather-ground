import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import { storyblok } from '@storyblok/astro';
import { loadEnv } from 'vite';
import path from 'node:path';
import mkcert from 'vite-plugin-mkcert';

const env = loadEnv('', process.cwd(), 'STORYBLOK');

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss(), mkcert()],
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
      bridge: {
        resolveRelations: [
          'testimonials_section.testimonials',
          'faq_section.faqs',
          'blog_section.posts',
        ],
      },
      enableFallbackComponent: true,
      components: {
        page: 'templates/Page.astro',
        hero_section: 'components/HeroSection/HeroSection.storyblok.astro',
        products_section:
          'components/ProductsSection/ProductsSection.storyblok.astro',
        testimonials_section:
          'components/TestimonialsSection/TestimonialsSection.storyblok.astro',
        faq_section: 'components/FaqSection/FaqSection.storyblok.astro',
        blog_section: 'components/BlogSection/BlogSection.storyblok.astro',
      },
    }),
  ],
});
