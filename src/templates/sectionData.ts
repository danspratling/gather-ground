/**
 * Section data normalizers — convert raw Sanity section objects
 * into the typed props each component expects.
 *
 * Lives in a .ts file (not .astro) because TypeScript generics
 * like `Array<Record<string, unknown>>` are ambiguous with JSX
 * inside an .astro template body.
 */
import { stegaClean } from '@sanity/client/stega';
import type { CallToActionProps } from '@/components/CallToAction/CallToAction.types';
import type { ContentProps } from '@/components/Content/Content.types';
import type { TestimonialsSectionTestimonial } from '@/components/TestimonialsSection/TestimonialsSection.types';
import { resolveSanityLink } from '@/lib/sanityLink';
import { sanityImageSrc, sanityImageAlt } from '@/lib/sanityImage';

/**
 * Strip stega-encoded invisible Unicode from a string value.
 *
 * Sanity's Visual Editing stega encoding appends invisible characters to
 * every string field so the overlay can map rendered text back to its source
 * field. That's fine for user-facing copy (heading, body), but it breaks any
 * value used for control flow — `'right' + stega chars !== 'right'`, so
 * equality checks and dispatch-key lookups fail silently.
 *
 * Always run enum-like / discriminator values (variant, position, alignment,
 * icon names, etc.) through this helper before using them.
 */
function enumClean<T extends string>(value: T | undefined): T | undefined {
  return value != null ? (stegaClean(value) as T) : undefined;
}

export type SanitySection = Record<string, unknown> & {
  _type: string;
  _key: string;
};

type Dict = Record<string, unknown>;
type SanityImage = { asset?: { _ref: string }; alt?: string } | undefined;

function arr(value: unknown): Dict[] {
  return (Array.isArray(value) ? value : []) as Dict[];
}

function img(
  image: unknown,
  fallbackAlt?: string,
  options?: { width?: number; height?: number; quality?: number }
) {
  return {
    src: sanityImageSrc(
      image as { asset?: { _ref: string } },
      options ?? { width: 800, quality: 80 }
    ),
    alt: sanityImageAlt(image as { alt?: string }, fallbackAlt),
  };
}

function formatDate(dateStr: string | undefined): string {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function cta(label: unknown, href: unknown) {
  const lbl = label as string | undefined;
  if (!lbl) return undefined;
  return { label: lbl, href: resolveSanityLink(href) };
}

export function heroSectionProps(s: Dict) {
  return {
    headline: s.headline as string,
    subCopy: s.subCopy as string,
    primaryCta: {
      label: s.primaryCtaLabel as string,
      href: resolveSanityLink(s.primaryCtaHref),
    },
    secondaryCta: cta(s.secondaryCtaLabel, s.secondaryCtaHref),
    image: s.image
      ? img(s.image, undefined, { width: 1216, quality: 80 })
      : undefined,
  };
}

export function productsSectionProps(s: Dict) {
  const variant = enumClean(s.variant as 'cards' | 'carousel') ?? 'cards';
  return {
    variant,
    eyebrow: s.eyebrow as string,
    heading: s.heading as string,
    subCopy: s.subCopy as string,
    products: arr(s.products).map((p) => ({
      image: sanityImageSrc(p.image as { asset?: { _ref: string } }, {
        width: 600,
        quality: 80,
      }),
      imageAlt: sanityImageAlt(p.image as { alt?: string }),
      title: p.title as string,
      description:
        variant === 'cards' ? (p.description as string | undefined) : undefined,
      href: resolveSanityLink(p.href),
    })),
  };
}

export function testimonialsSectionProps(s: Dict) {
  return {
    heading: s.heading as string,
    subCopy: s.subCopy as string,
    testimonials: arr(s.testimonials).map<TestimonialsSectionTestimonial>(
      (t) => ({
        quote: t.quote as string,
        platform:
          enumClean(t.platform as TestimonialsSectionTestimonial['platform']) ||
          undefined,
        author: {
          src: sanityImageSrc(t.authorImage as { asset?: { _ref: string } }, {
            width: 96,
            quality: 80,
          }),
          alt: sanityImageAlt(t.authorImage as { alt?: string }),
          name: t.authorName as string,
          secondary: (t.authorSecondary as string) || undefined,
          secondaryIsHandle: (t.authorSecondaryIsHandle as boolean) ?? false,
          size: 'md' as const,
        },
      })
    ),
  };
}

export function faqSectionProps(s: Dict) {
  const ctaHeading = s.ctaHeading as string | undefined;
  return {
    heading: s.heading as string,
    subCopy: (s.subCopy as string) ?? '',
    items: arr(s.faqs).map((f) => ({
      title: f.title as string,
      detail: f.detail as string,
    })),
    cta: ctaHeading
      ? {
          heading: ctaHeading,
          body: (s.ctaBody as string) ?? '',
          primaryButton: {
            label: (s.ctaPrimaryLabel as string) ?? '',
            href: resolveSanityLink(s.ctaPrimaryHref),
            variant: 'default' as const,
            size: 'md' as const,
          },
          secondaryButton: s.ctaSecondaryLabel
            ? {
                label: s.ctaSecondaryLabel as string,
                href: resolveSanityLink(s.ctaSecondaryHref),
                variant: 'outline' as const,
                size: 'md' as const,
              }
            : undefined,
        }
      : undefined,
  };
}

export function blogSectionProps(s: Dict) {
  return {
    eyebrow: (s.eyebrow as string) ?? '',
    heading: s.heading as string,
    subCopy: (s.subCopy as string) ?? '',
    viewAllHref: resolveSanityLink(s.viewAllHref),
    viewAllLabel: s.viewAllLabel as string | undefined,
    posts: arr(s.posts).map((p) => {
      const author = p.author as Dict | undefined;
      return {
        image: sanityImageSrc(p.image as { asset?: { _ref: string } }, {
          width: 600,
          quality: 80,
        }),
        imageAlt: sanityImageAlt(
          p.image as { alt?: string },
          p.title as string
        ),
        title: p.title as string,
        excerpt: p.excerpt as string,
        date: formatDate(p.publishedAt as string),
        authorName: (author?.name as string) ?? '',
        authorImage: author?.avatar
          ? sanityImageSrc(author.avatar as { asset?: { _ref: string } }, {
              width: 96,
              quality: 80,
            })
          : '',
        authorImageAlt: (author?.name as string) ?? '',
        href: '/blog/' + (p.slug as string),
      };
    }),
  };
}

export function callToActionProps(s: Dict): CallToActionProps {
  const variant =
    enumClean(s.variant as CallToActionProps['variant']) ?? 'simple-centered';
  const base = {
    heading: s.heading as string,
    body: s.body as string,
    primaryCta: {
      label: s.primaryCtaLabel as string,
      href: resolveSanityLink(s.primaryCtaHref),
    },
    secondaryCta: cta(s.secondaryCtaLabel, s.secondaryCtaHref),
  };
  if (variant === 'split-image') {
    return { variant, ...base, image: img(s.image) };
  }
  return { variant, ...base };
}

export function contentSectionProps(
  s: Dict,
  resolvedImagePosition?: 'left' | 'right'
): ContentProps {
  const variant = enumClean(s.variant as ContentProps['variant']) ?? 'simple';
  const heading = s.heading as string;
  const body = s.body as string;
  const dark = (s.dark as boolean) ?? false;

  if (variant === 'alternating') {
    return {
      variant,
      heading,
      body,
      dark,
      icon: enumClean(s.icon as string | undefined),
      checklistItems: s.checklistItems as string | undefined,
      image: img(s.image),
      // Position is resolved at the page level by
      // resolveAlternatingPositions() so consecutive alternating sections
      // auto-flip. Fall back to the raw value (or 'right') for callers
      // that don't precompute — e.g. Storybook stories.
      imagePosition:
        resolvedImagePosition ??
        (() => {
          const raw = enumClean(s.imagePosition as string | undefined);
          return raw === 'left' || raw === 'right' ? raw : 'right';
        })(),
    };
  }
  if (variant === 'icons-featured-image') {
    return {
      variant,
      heading,
      body,
      dark,
      eyebrow: (s.eyebrow as string) ?? '',
      image: img(s.image),
      features: arr(s.iconFeatures).map((f) => ({
        icon: enumClean(f.icon as string) ?? '',
        heading: f.heading as string,
        body: f.body as string,
      })),
    };
  }
  if (variant === 'title') {
    return {
      variant,
      heading,
      body,
      dark,
      eyebrow: (s.eyebrow as string) ?? '',
      align: enumClean(s.align as 'left' | 'center') ?? 'left',
    };
  }
  return {
    variant: 'simple',
    heading,
    body,
    dark,
    icon: enumClean(s.icon as string | undefined),
    features: arr(s.features).map((f) => ({
      heading: f.heading as string,
      body: f.body as string,
    })),
  };
}

export function contactHeroProps(s: Dict) {
  return {
    heading: s.heading as string,
    body: s.body as string | undefined,
    embedUrl: (s.mapEmbedUrl as string) ?? '',
    mapTitle: (s.mapTitle as string) ?? 'Our location',
  };
}

export function instagramFeedSectionProps(
  s: Dict,
  instagramHandle?: string,
  beholdFeedId?: string
) {
  return {
    eyebrow: (s.eyebrow as string) || undefined,
    heading: s.heading as string,
    subCopy: (s.subCopy as string) || undefined,
    viewAllLabel: (s.viewAllLabel as string) || undefined,
    handle: instagramHandle != null ? (stegaClean(instagramHandle) as string) : undefined,
    feedId: beholdFeedId != null ? (stegaClean(beholdFeedId) as string) : undefined,
  };
}

/**
 * Resolve image positions for every alternating `contentSection` on a page.
 *
 * Behaviour:
 *  - The first alternating section defaults to image on the right.
 *  - Each subsequent alternating section flips to the opposite side of the
 *    previous one (sections of other types in between do not reset it).
 *  - An explicit `left` or `right` override wins and becomes the new
 *    baseline that following `auto` sections continue alternating from.
 *
 * Returned as a `Map` keyed by Sanity `_key` so the mapper can look the
 * resolved value up at render time without re-walking the array.
 */
export function resolveAlternatingPositions(
  sections: SanitySection[]
): Map<string, 'left' | 'right'> {
  const resolved = new Map<string, 'left' | 'right'>();
  let last: 'left' | 'right' | null = null;

  for (const section of sections) {
    if (section._type !== 'contentSection') continue;
    if (enumClean(section.variant as string | undefined) !== 'alternating') {
      continue;
    }

    const override = enumClean(section.imagePosition as string | undefined);
    let position: 'left' | 'right';

    if (override === 'left' || override === 'right') {
      position = override;
    } else if (last === 'right') {
      position = 'left';
    } else if (last === 'left') {
      position = 'right';
    } else {
      // First alternating section on the page — start on the right.
      position = 'right';
    }

    resolved.set(section._key, position);
    last = position;
  }

  return resolved;
}
