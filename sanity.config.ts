import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { presentationTool } from 'sanity/presentation';
import {
  link,
  callout,
  pages,
  blogPage,
  blogPosts,
  productPage,
  products,
  authors,
  faqs,
  testimonials,
  legalPages,
  heroSection,
  productsSection,
  productCard,
  testimonialsSection,
  faqSection,
  blogSection,
  callToAction,
  contactSection,
  contentSection,
  contentFeatureItem,
  contentIconFeature,
  siteSettings,
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
              .title('Site Settings')
              .id('siteSettings')
              .child(
                S.document()
                  .schemaType('siteSettings')
                  .documentId('siteSettings')
              ),
            S.listItem()
              .title('Blog Page')
              .id('blogPage')
              .child(
                S.document().schemaType('blogPage').documentId('blogPage')
              ),
            S.listItem()
              .title('Product Page')
              .id('productPage')
              .child(
                S.document().schemaType('productPage').documentId('productPage')
              ),
            S.divider(),
            ...S.documentTypeListItems().filter(
              (listItem) =>
                !['siteSettings', 'blogPage', 'productPage'].includes(
                  listItem.getId() ?? ''
                )
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
          pages: {
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
          blogPosts: {
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
          productPage: {
            select: { _id: '_id' },
            resolve: () => ({
              locations: [{ title: 'Products', href: '/products' }],
            }),
          },
          products: {
            select: { title: 'title', slug: 'slug.current' },
            resolve: (doc) => ({
              locations: [
                {
                  title: doc?.title || 'Untitled',
                  href: doc?.slug ? `/products/${doc.slug}` : '/products',
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
      // Singletons
      siteSettings,
      // Shared types
      link,
      callout,
      // Documents
      pages,
      blogPage,
      blogPosts,
      productPage,
      products,
      authors,
      faqs,
      testimonials,
      legalPages,
      // Page section objects
      heroSection,
      productsSection,
      productCard,
      testimonialsSection,
      faqSection,
      blogSection,
      callToAction,
      contactSection,
      contentSection,
      contentFeatureItem,
      contentIconFeature,
    ],
  },
  document: {
    // Hide singleton types from the global "Create new" menu so editors
    // can't create duplicates that would conflict with the singleton query.
    newDocumentOptions: (prev, { creationContext }) =>
      creationContext.type === 'global'
        ? prev.filter(
            (templateItem) =>
              !['siteSettings', 'blogPage', 'productPage'].includes(
                templateItem.templateId
              )
          )
        : prev,
    // Remove duplicate/delete actions for singletons so editors can't
    // accidentally remove the canonical document.
    actions: (prev, { schemaType }) =>
      ['siteSettings', 'blogPage', 'productPage'].includes(schemaType)
        ? prev.filter(
            ({ action }) => !['duplicate', 'delete'].includes(action ?? '')
          )
        : prev,
  },
});
