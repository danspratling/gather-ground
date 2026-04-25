/**
 * GROQ queries for Sanity data fetching.
 * All queries are co-located here for maintainability.
 */

// ─── Link sub-projection ────────────────────────────────────────────
// Reusable projection for the `link` object type.
export const linkProjection = `{
  type,
  url,
  email,
  anchor,
  internalLink->{ _type, slug }
}`;

// ─── Body sections projection ───────────────────────────────────────
// Reusable projection for the section-array `body` field, shared by
// `page`, `productPage`, and `products` documents.
export const bodySectionsProjection = `body[]{
  _type,
  _key,

  // heroSection
  _type == "heroSection" => {
    headline,
    subCopy,
    primaryCtaLabel,
    primaryCtaHref ${linkProjection},
    secondaryCtaLabel,
    secondaryCtaHref ${linkProjection},
    image { asset->, alt }
  },

  // productsSection
  _type == "productsSection" => {
    variant,
    eyebrow,
    heading,
    subCopy,
    products[]{
      _key,
      image { asset->, alt },
      title,
      description,
      href ${linkProjection}
    }
  },

  // testimonialsSection
  _type == "testimonialsSection" => {
    heading,
    subCopy,
    testimonials[]->{
      _id,
      quote,
      platform,
      authorImage { asset->, alt },
      authorName,
      authorSecondary,
      authorSecondaryIsHandle
    }
  },

  // faqSection
  _type == "faqSection" => {
    heading,
    subCopy,
    faqs[]->{
      _id,
      title,
      detail
    },
    ctaHeading,
    ctaBody,
    ctaPrimaryLabel,
    ctaPrimaryHref ${linkProjection},
    ctaSecondaryLabel,
    ctaSecondaryHref ${linkProjection}
  },

  // blogSection
  _type == "blogSection" => {
    eyebrow,
    heading,
    subCopy,
    viewAllHref ${linkProjection},
    viewAllLabel,
    posts[]->{
      _id,
      title,
      "slug": slug.current,
      image { asset->, alt },
      excerpt,
      publishedAt,
      author->{
        name,
        avatar { asset-> }
      }
    }
  },

  // callToAction
  _type == "callToAction" => {
    variant,
    heading,
    body,
    primaryCtaLabel,
    primaryCtaHref ${linkProjection},
    secondaryCtaLabel,
    secondaryCtaHref ${linkProjection},
    image { asset->, alt }
  },

  // contentSection
  _type == "contentSection" => {
    variant,
    eyebrow,
    icon,
    heading,
    body,
    features[]{ _key, heading, body },
    iconFeatures[]{ _key, icon, heading, body },
    checklistItems,
    image { asset->, alt },
    imagePosition,
    align,
    dark
  }
}`;

// ─── Page queries ───────────────────────────────────────────────────

/** Fetch all page slugs for static path generation. */
export const allPageSlugsQuery = `*[_type == "pages"]{ "slug": slug.current }`;

/** Fetch a single page by slug with all nested section data resolved. */
export const pageBySlugQuery = `*[_type == "pages" && slug.current == $slug][0]{
  _id,
  _type,
  _updatedAt,
  "_originalId": _originalId,
  title,
  "slug": slug.current,
  metaTitle,
  metaDescription,
  "ogImage": ogImage.asset->url,
  "autoDescription": body[_type == "heroSection"][0].subCopy,
  "autoOgImage": body[_type == "heroSection"][0].image.asset->url,
  ${bodySectionsProjection}
}`;

// ─── Products queries ───────────────────────────────────────────────

/** Fetch the singleton productPage document (the /products landing page). */
export const productPageQuery = `*[_type == "productPage"][0]{
  _id,
  _type,
  _updatedAt,
  "_originalId": _originalId,
  title,
  metaTitle,
  metaDescription,
  "ogImage": ogImage.asset->url,
  "autoDescription": body[_type == "heroSection"][0].subCopy,
  "autoOgImage": body[_type == "heroSection"][0].image.asset->url,
  ${bodySectionsProjection}
}`;

/** Fetch all product slugs for static path generation. */
export const allProductSlugsQuery = `*[_type == "products" && defined(slug.current)]{ "slug": slug.current }`;

/** Fetch a single product by slug. */
export const productBySlugQuery = `*[_type == "products" && slug.current == $slug][0]{
  _id,
  _type,
  _updatedAt,
  "_originalId": _originalId,
  title,
  "slug": slug.current,
  metaTitle,
  metaDescription,
  "ogImage": ogImage.asset->url,
  "autoDescription": body[_type == "heroSection"][0].subCopy,
  "autoOgImage": body[_type == "heroSection"][0].image.asset->url,
  ${bodySectionsProjection}
}`;

// ─── Blog queries ───────────────────────────────────────────────────

/** Fetch blog page settings (hero content). */
export const blogPageQuery = `*[_type == "blogPage"][0]{
  _id,
  _type,
  _updatedAt,
  "_originalId": _originalId,
  metaTitle,
  metaDescription,
  heroEyebrow,
  heroHeading,
  heroSubCopy,
  heroPrivacyPolicyLink ${linkProjection}
}`;

/** Fetch all blog posts sorted by publish date. */
export const allBlogPostsQuery = `*[_type == "blogPosts"] | order(publishedAt desc){
  _id,
  title,
  "slug": slug.current,
  image { asset->, alt },
  excerpt,
  categories,
  publishedAt,
  author->{
    name,
    avatar { asset-> }
  }
}`;

/** Fetch all blog post slugs for static path generation. Excludes posts missing required fields. */
export const allBlogPostSlugsQuery = `*[_type == "blogPosts" && defined(slug.current) && defined(publishedAt)]{ "slug": slug.current }`;

/** Fetch a single blog post by slug. */
export const blogPostBySlugQuery = `*[_type == "blogPosts" && slug.current == $slug][0]{
  _id,
  _type,
  _updatedAt,
  "_originalId": _originalId,
  title,
  "slug": slug.current,
  image { asset->, alt },
  excerpt,
  categories,
  publishedAt,
  body,
  metaTitle,
  metaDescription,
  author->{
    name,
    avatar { asset-> },
    role
  }
}`;

/** Fetch related blog posts (exclude current slug). */
export const relatedBlogPostsQuery = `*[_type == "blogPosts" && slug.current != $slug] | order(publishedAt desc) [0...3]{
  _id,
  title,
  "slug": slug.current,
  image { asset->, alt },
  excerpt,
  publishedAt,
  author->{
    name,
    avatar { asset-> }
  }
}`;

// ─── Site Settings ──────────────────────────────────────────────────

/** Fetch the singleton siteSettings document. */
export const siteSettingsQuery = `*[_id == "siteSettings"][0]{
  siteName,
  siteDescription,
  logoAlt,
  "logo": logo.asset->url,
  defaultMetaTitle,
  defaultMetaDescription,
  "defaultOgImage": defaultOgImage.asset->url,
  primaryNav[]{
    label,
    link ${linkProjection},
    menu[]{
      label,
      link ${linkProjection},
      description
    }
  },
  headerCtaLabel,
  headerCtaLink ${linkProjection},
  footerDescription,
  footerLinkGroups[]{
    heading,
    links[]{
      label,
      link ${linkProjection}
    }
  },
  socialLinks,
  copyrightText,
  footerLegalLinks[]{
    label,
    link ${linkProjection}
  },
  announcementBanner{
    enabled,
    message,
    ctaLabel,
    ctaLink ${linkProjection},
    variant
  }
}`;

// ─── Legal Pages ────────────────────────────────────────────────────

/** Fetch a single legal page by slug. */
export const legalPageQuery = `*[_type == "legalPage" && slug.current == $slug][0]{
  _id,
  title,
  "slug": slug.current,
  body
}`;

export default null;
