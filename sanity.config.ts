import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { presentationTool } from 'sanity/presentation';
import {
  link,
  callout,
  page,
  blogPage,
  blogPost,
  productsPage,
  product,
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
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            S.listItem()
              .title('Products Page')
              .id('productsPage')
              .child(
                S.document()
                  .schemaType('productsPage')
                  .documentId('productsPage')
              ),
            S.divider(),
            ...S.documentTypeListItems().filter(
              (listItem) => !['productsPage'].includes(listItem.getId() ?? '')
            ),
          ]),
    }),
    presentationTool({
      previewUrl: {
        origin:
          typeof window !== 'undefined' && window.location.origin
            ? window.location.origin
            : 'http://localhost:4321',
      },
      resolve: {
        locations: {
          page: {
            select: { title: 'title', slug: 'slug.current' },
            resolve: (doc) => ({
              locations: [
                {
                  title: doc?.title || 'Untitled',
                  href: doc?.slug === '/' || !doc?.slug ? '/' : `/${doc.slug}`,
                },
              ],
            }),
          },
          blogPost: {
            select: { title: 'title', slug: 'slug.current' },
            resolve: (doc) => ({
              locations: [
                {
                  title: doc?.title || 'Untitled',
                  href: `/blog/${doc?.slug}`,
                },
              ],
            }),
          },
          blogPage: {
            select: { _id: '_id' },
            resolve: () => ({
              locations: [{ title: 'Blog', href: '/blog' }],
            }),
          },
          productsPage: {
            select: { _id: '_id' },
            resolve: () => ({
              locations: [{ title: 'Products', href: '/products' }],
            }),
          },
          product: {
            select: { title: 'title', slug: 'slug.current' },
            resolve: (doc) => ({
              locations: [
                {
                  title: doc?.title || 'Untitled',
                  href: `/products/${doc?.slug}`,
                },
              ],
            }),
          },
        },
      },
    }),
  ],
  schema: {
    types: [
      // Shared types
      link,
      callout,
      // Documents
      page,
      blogPage,
      blogPost,
      productsPage,
      product,
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
