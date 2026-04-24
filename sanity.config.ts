import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import {
  link,
  callout,
  page,
  blogPage,
  blogPost,
  author,
  faq,
  testimonial,
  heroSection,
  productsSection,
  productCard,
  testimonialsSection,
  faqSection,
  blogSection,
  callToAction,
  contentSection,
  contentFeatureItem,
  contentIconFeature,
} from './src/sanity/schemas';

export default defineConfig({
  name: 'gather-ground',
  title: 'Gather Ground',
  projectId: 'mrz1ftls',
  dataset: 'production',
  plugins: [structureTool()],
  schema: {
    types: [
      // Shared types
      link,
      callout,
      // Documents
      page,
      blogPage,
      blogPost,
      author,
      faq,
      testimonial,
      // Page section objects
      heroSection,
      productsSection,
      productCard,
      testimonialsSection,
      faqSection,
      blogSection,
      callToAction,
      contentSection,
      contentFeatureItem,
      contentIconFeature,
    ],
  },
});
