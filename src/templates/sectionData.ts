/**
 * Section data normalizers — convert raw Sanity section objects
 * into the typed props each component expects.
 *
 * Lives in a .ts file (not .astro) because TypeScript generics
 * like `Array<Record<string, unknown>>` are ambiguous with JSX
 * inside an .astro template body.
 */
import type { CallToActionProps } from '@/components/CallToAction/CallToAction.types';
import type { ContentProps } from '@/components/Content/Content.types';
import type { TestimonialsSectionTestimonial } from '@/components/TestimonialsSection/TestimonialsSection.types';
import { resolveSanityLink } from '@/lib/sanityLink';
import { sanityImageSrc, sanityImageAlt } from '@/lib/sanityImage';

export type SanitySection = Record<string, unknown> & {
  _type: string;
  _key: string;
};

type Dict = Record<string, unknown>;
type SanityImage = { asset?: { _ref: string }; alt?: string } | undefined;

function arr(value: unknown): Dict[] {
  return (Array.isArray(value) ? value : []) as Dict[];
}

function img(image: unknown, fallbackAlt?: string) {
  return {
    src: sanityImageSrc(image as { asset?: { _ref: string } }),
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
    image: s.image ? img(s.image) : undefined,
  };
}

export function productsSectionProps(s: Dict) {
  const variant = (s.variant as 'cards' | 'carousel') ?? 'cards';
  return {
    variant,
    eyebrow: s.eyebrow as string,
    heading: s.heading as string,
    subCopy: s.subCopy as string,
    products: arr(s.products).map((p) => ({
      image: sanityImageSrc(p.image as { asset?: { _ref: string } }),
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
          (t.platform as TestimonialsSectionTestimonial['platform']) ||
          undefined,
        author: {
          src: sanityImageSrc(t.authorImage as { asset?: { _ref: string } }),
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
        image: sanityImageSrc(p.image as { asset?: { _ref: string } }),
        imageAlt: sanityImageAlt(
          p.image as { alt?: string },
          p.title as string
        ),
        title: p.title as string,
        excerpt: p.excerpt as string,
        date: formatDate(p.publishedAt as string),
        authorName: (author?.name as string) ?? '',
        authorImage: author?.avatar
          ? sanityImageSrc(author.avatar as { asset?: { _ref: string } })
          : '',
        authorImageAlt: (author?.name as string) ?? '',
        href: '/blog/' + (p.slug as string).replace(/^\/+/, ''),
      };
    }),
  };
}

export function callToActionProps(s: Dict): CallToActionProps {
  const variant =
    (s.variant as CallToActionProps['variant']) ?? 'simple-centered';
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

export function contentSectionProps(s: Dict): ContentProps {
  const variant = (s.variant as ContentProps['variant']) ?? 'simple';
  const heading = s.heading as string;
  const body = s.body as string;
  const dark = (s.dark as boolean) ?? false;

  if (variant === 'alternating') {
    return {
      variant,
      heading,
      body,
      dark,
      icon: s.icon as string | undefined,
      checklistItems: s.checklistItems as string | undefined,
      image: img(s.image),
      imagePosition: (s.imagePosition as 'left' | 'right') ?? 'right',
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
        icon: f.icon as string,
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
      align: (s.align as 'left' | 'center') ?? 'left',
    };
  }
  return {
    variant: 'simple',
    heading,
    body,
    dark,
    icon: s.icon as string | undefined,
    features: arr(s.features).map((f) => ({
      heading: f.heading as string,
      body: f.body as string,
    })),
  };
}
