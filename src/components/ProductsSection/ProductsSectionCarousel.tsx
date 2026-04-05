import * as React from 'react';
import type { UseEmblaCarouselType } from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from '@untitledui-pro/icons/line';
import {
  Carousel as ShadcnCarousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import type { ProductsSectionProps } from './ProductsSection.types';

type CarouselApi = UseEmblaCarouselType[1];
type Props = Omit<ProductsSectionProps, 'variant'>;

function ProductImageCard({
  image,
  title,
  href,
}: {
  image: string;
  title: string;
  href: string;
}) {
  return (
    <article className="relative w-72 overflow-hidden rounded-xl">
      <a href={href} className="group block">
        <img
          src={image}
          alt=""
          className="h-64 w-full object-cover transition-transform duration-300 group-hover:scale-105 group-focus:scale-105"
        />
        <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 to-transparent p-6">
          <h3 className="text-xl font-semibold text-off-white">{title}</h3>
        </div>
      </a>
    </article>
  );
}

export default function ProductsSectionCarousel({
  eyebrow,
  heading,
  subCopy,
  products,
}: Props) {
  const [api, setApi] = React.useState<CarouselApi>(undefined);
  const [canScrollPrev, setCanScrollPrev] = React.useState(false);
  const [canScrollNext, setCanScrollNext] = React.useState(false);

  React.useEffect(() => {
    if (!api) return;

    const update = () => {
      setCanScrollPrev(api.canScrollPrev());
      setCanScrollNext(api.canScrollNext());
    };

    api.on('select', update);
    api.on('reInit', update);
    update();

    return () => {
      api.off('select', update);
      api.off('reInit', update);
    };
  }, [api]);

  return (
    <section className="py-12 lg:py-24">
      <div className="container flex flex-col gap-10 lg:gap-16">
        <div className="flex items-end justify-between gap-8">
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-3">
              <p className="text-sm font-semibold text-brand-700">{eyebrow}</p>
              <h2 className="text-display-md font-semibold tracking-display-md text-gray-900">
                {heading}
              </h2>
            </div>
            <p className="text-xl text-gray-600">{subCopy}</p>
          </div>
          <div className="hidden shrink-0 gap-6 md:flex">
            <button
              type="button"
              onClick={() => api?.scrollPrev()}
              disabled={!canScrollPrev}
              aria-label="Previous slide"
              className="flex items-center justify-center rounded-full border border-brand-50 bg-off-white p-3.5 text-gray-700 hover:bg-brand-25 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft className="size-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => api?.scrollNext()}
              disabled={!canScrollNext}
              aria-label="Next slide"
              className="flex items-center justify-center rounded-full border border-brand-50 bg-off-white p-3.5 text-gray-700 hover:bg-brand-25 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronRight className="size-5" aria-hidden="true" />
            </button>
          </div>
        </div>
        <ShadcnCarousel
          setApi={setApi}
          opts={{ align: 'start' }}
          aria-label="Product images"
        >
          <CarouselContent className="-ml-6">
            {products.map((product, i) => (
              <CarouselItem key={i} className="basis-auto pl-6">
                <ProductImageCard
                  image={product.image}
                  title={product.title}
                  href={product.href}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        </ShadcnCarousel>
      </div>
    </section>
  );
}
