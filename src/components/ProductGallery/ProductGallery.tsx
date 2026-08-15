import * as React from 'react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  useCarousel,
} from '@/components/ui/carousel';
import { Expand01 } from '@untitledui-pro/icons/line';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import type { ProductGalleryProps } from './ProductGallery.types';

function GalleryDots() {
  const { api } = useCarousel();
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
    <div className="mt-4 flex items-center justify-center gap-2">
      {Array.from({ length: count }).map((_, i) => (
        <button
          key={i}
          type="button"
          onClick={() => api?.scrollTo(i)}
          aria-label={`Go to slide ${i + 1}`}
          className={cn(
            'size-2 rounded-full transition-colors',
            i === current ? 'bg-brand-700' : 'bg-brand-200'
          )}
        />
      ))}
    </div>
  );
}

export default function ProductGallery({
  images,
  productTitle,
  selectedVariantImage,
  class: className,
}: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const heroImage = selectedVariantImage ?? images[activeIndex] ?? images[0];
  const heroAlt = heroImage?.altText ?? productTitle;

  const slides = selectedVariantImage
    ? [selectedVariantImage, ...images]
    : images;

  if (!heroImage) {
    return (
      <div
        className={cn(
          'flex aspect-square w-full items-center justify-center rounded-2xl bg-secondary-100',
          className
        )}
      >
        <span className="text-sm text-secondary-400">No image available</span>
      </div>
    );
  }

  return (
    <div className={cn('w-full', className)}>
      {/* Mobile carousel — visible below lg breakpoint */}
      <div className="block lg:hidden">
        <Carousel
          opts={{ align: 'center', loop: false }}
          aria-label="Product images"
        >
          <CarouselContent>
            {slides.map((img, i) => (
              <CarouselItem key={img.url} className="basis-full">
                <img
                  src={img.url}
                  alt={img.altText ?? productTitle}
                  loading={i === 0 ? 'eager' : 'lazy'}
                  width={800}
                  height={800}
                  className="aspect-square w-full rounded-2xl object-cover"
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <GalleryDots />
        </Carousel>
      </div>

      {/* Desktop layout — visible from lg breakpoint */}
      <div className="hidden lg:flex lg:flex-col">
        {/* Hero slot — clicking opens the lightbox */}
        <button
          type="button"
          onClick={() => setLightboxOpen(true)}
          aria-label="Open image lightbox"
          className="group relative w-full overflow-hidden rounded-2xl"
        >
          <img
            src={heroImage.url}
            alt={heroAlt}
            loading="eager"
            width={800}
            height={800}
            className="aspect-square w-full object-cover"
          />
          <span className="absolute right-3 top-3 flex items-center justify-center rounded-lg bg-white/80 p-2 opacity-0 transition-opacity group-hover:opacity-100">
            <Expand01 className="size-5 text-brand-700" aria-hidden="true" />
          </span>
        </button>

        {/* Thumbnail rail — only rendered when there are multiple images */}
        {images.length > 1 && (
          <div className="mt-4 flex gap-3">
            {images.map((img, i) => (
              <button
                key={img.url}
                type="button"
                onClick={() => setActiveIndex(i)}
                aria-label={`View image ${i + 1}`}
                className={cn(
                  'size-16 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-colors',
                  i === activeIndex && !selectedVariantImage
                    ? 'border-brand-700'
                    : 'border-transparent hover:border-brand-200'
                )}
              >
                <img
                  src={img.url}
                  alt={img.altText ?? productTitle}
                  loading="lazy"
                  width={64}
                  height={64}
                  className="h-full w-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox — Dialog portal, no layout impact */}
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="max-w-3xl p-2">
          <DialogTitle className="sr-only">{heroAlt}</DialogTitle>
          <img
            src={heroImage.url}
            alt={heroAlt}
            loading="lazy"
            className="h-auto w-full rounded-xl object-contain"
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
