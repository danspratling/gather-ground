import * as React from 'react';

import {
  Carousel as ShadcnCarousel,
  CarouselContent,
  CarouselItem,
  useCarousel,
} from '@/components/ui/carousel';
import { ChevronLeft, ChevronRight } from '@untitledui-pro/icons/line';
import { cn } from '@/lib/utils';
import type { CarouselProps } from './Carousel.types';

function CarouselButtons() {
  const { scrollPrev, scrollNext, canScrollPrev, canScrollNext } =
    useCarousel();

  if (!canScrollPrev && !canScrollNext) return null;

  return (
    <div className="mb-8 flex justify-end gap-6">
      <button
        type="button"
        onClick={scrollPrev}
        disabled={!canScrollPrev}
        aria-label="Previous slide"
        className="flex items-center justify-center rounded-full border border-brand-50 bg-off-white p-3.5 text-brand-700 hover:bg-brand-25 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ChevronLeft className="size-5" aria-hidden="true" />
      </button>
      <button
        type="button"
        onClick={scrollNext}
        disabled={!canScrollNext}
        aria-label="Next slide"
        className="flex items-center justify-center rounded-full border border-brand-50 bg-off-white p-3.5 text-brand-700 hover:bg-brand-25 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ChevronRight className="size-5" aria-hidden="true" />
      </button>
    </div>
  );
}

function CarouselDots() {
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

type Props = React.PropsWithChildren<CarouselProps>;

export default function Carousel({
  variant = 'buttons',
  label = 'Carousel',
  class: className,
  children,
}: Props) {
  const items = React.Children.toArray(children);
  const showButtons = variant === 'buttons' || variant === 'both';
  const showDots = variant === 'dots' || variant === 'both';

  return (
    <ShadcnCarousel
      opts={{ align: 'start' }}
      className={cn('w-full', className)}
      aria-label={label}
    >
      {showButtons && <CarouselButtons />}
      <CarouselContent className="-ml-6">
        {items.map((item, i) => (
          <CarouselItem key={i} className="basis-auto pl-6">
            {item}
          </CarouselItem>
        ))}
      </CarouselContent>
      {showDots && <CarouselDots />}
    </ShadcnCarousel>
  );
}
