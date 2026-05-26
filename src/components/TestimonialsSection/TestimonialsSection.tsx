import * as React from 'react';
import {
  Carousel as ShadcnCarousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import { buttonClasses } from '@/components/Forms/Button/buttonClasses';
import { cn } from '@/lib/utils';
import type { TestimonialsSectionProps } from './TestimonialsSection.types';

const platformLabel: Record<string, string> = {
  twitter: 'Twitter / X',
  instagram: 'Instagram',
  facebook: 'Facebook',
  tiktok: 'TikTok',
  linkedin: 'LinkedIn',
};

function CarouselDots({
  api,
}: {
  api: import('embla-carousel-react').UseEmblaCarouselType[1] | undefined;
}) {
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    if (!api) return;

    const update = () => {
      setCount(api.scrollSnapList().length);
      setCurrent(api.selectedScrollSnap());
    };

    api.on('select', update);
    api.on('reInit', update);
    update();

    return () => {
      api.off('select', update);
      api.off('reInit', update);
    };
  }, [api]);

  if (count <= 1) return null;

  return (
    <div className="mt-6 flex items-center justify-center gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <button
          key={i}
          type="button"
          onClick={() => api?.scrollTo(i)}
          aria-label={`Go to slide ${i + 1}`}
          className={cn(
            'size-2.5 rounded-full transition-colors',
            i === current ? 'bg-brand-700' : 'bg-brand-50'
          )}
        />
      ))}
    </div>
  );
}

type CarouselApi = import('embla-carousel-react').UseEmblaCarouselType[1];

function CtaLink({
  label,
  href,
  variant,
}: {
  label: string;
  href: string;
  variant: 'default' | 'outline';
}) {
  // Trustpilot / other review platforms are external — open externally so
  // visitors don't lose the page they were reading.
  const isExternal = /^https?:\/\//.test(href);
  return (
    <a
      href={href}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
      className={buttonClasses({ variant, size: 'lg' })}
    >
      {label}
    </a>
  );
}

export default function TestimonialsSection({
  heading,
  subCopy,
  testimonials,
  ctaPrimary,
  ctaSecondary,
}: TestimonialsSectionProps) {
  const [api, setApi] = React.useState<CarouselApi>(undefined);

  return (
    <section className="py-12 lg:py-24">
      <div className="container flex flex-col gap-10 lg:flex-row lg:items-center lg:gap-16">
        <div className="flex flex-col gap-5 lg:w-2/5 lg:shrink-0">
          <h2 className="text-display-md font-semibold tracking-display-md text-gray-900">
            {heading}
          </h2>
          <p className="text-xl text-brand-500">{subCopy}</p>
          {(ctaPrimary || ctaSecondary) && (
            <div className="mt-3 flex flex-wrap gap-3">
              {ctaPrimary && (
                <CtaLink
                  label={ctaPrimary.label}
                  href={ctaPrimary.href}
                  variant="default"
                />
              )}
              {ctaSecondary && (
                <CtaLink
                  label={ctaSecondary.label}
                  href={ctaSecondary.href}
                  variant="outline"
                />
              )}
            </div>
          )}
        </div>
        <div className="lg:flex-1">
          <ShadcnCarousel
            setApi={setApi}
            opts={{ align: 'start' }}
            aria-label="Customer testimonials"
          >
            <CarouselContent className="-ml-6">
              {testimonials.map((testimonial, i) => (
                <CarouselItem key={i} className="basis-full pl-6 md:basis-1/2">
                  <article className="flex h-full flex-col gap-6 rounded-xl bg-secondary-50 p-8">
                    {testimonial.rating ? (
                      <div
                        className="flex gap-0.5 text-amber-400"
                        aria-label={`${testimonial.rating} out of 5 stars`}
                      >
                        {Array.from({ length: testimonial.rating }).map(
                          (_, i) => (
                            <span
                              key={i}
                              aria-hidden="true"
                              className="text-xl leading-none"
                            >
                              ★
                            </span>
                          )
                        )}
                      </div>
                    ) : (
                      testimonial.platform && (
                        <p className="text-sm font-medium text-brand-500">
                          {platformLabel[testimonial.platform]}
                        </p>
                      )
                    )}
                    <blockquote className="flex-1 text-base font-normal text-gray-900">
                      &ldquo;{testimonial.quote}&rdquo;
                    </blockquote>
                    <div className="flex items-center gap-3">
                      {testimonial.author.src && (
                        <img
                          src={testimonial.author.src}
                          alt={testimonial.author.alt ?? ''}
                          className="size-10 rounded-full object-cover"
                          width={40}
                          height={40}
                          loading="lazy"
                          decoding="async"
                        />
                      )}
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-gray-900">
                          {testimonial.author.name}
                        </span>
                        {testimonial.author.secondary && (
                          <span className="text-sm text-brand-500">
                            {testimonial.author.secondary}
                          </span>
                        )}
                      </div>
                    </div>
                  </article>
                </CarouselItem>
              ))}
            </CarouselContent>
          </ShadcnCarousel>
          <CarouselDots api={api} />
        </div>
      </div>
    </section>
  );
}
