import * as React from 'react';
import type { UseEmblaCarouselType } from 'embla-carousel-react';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from '@untitledui-pro/icons/line';
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
    <article className="w-72 overflow-hidden rounded-xl">
      <a href={href} className="group flex flex-col">
        <div className="overflow-hidden rounded-xl">
          <img
            src={image}
            alt=""
            className="h-64 w-full object-cover transition-transform duration-300 group-hover:scale-105 group-focus:scale-105"
            width={600}
            height={256}
            loading="lazy"
            decoding="async"
          />
        </div>
        <div className="flex items-center justify-between gap-4 p-4">
          <h3 className="text-base font-semibold text-gray-900 group-hover:underline group-focus:underline">
            {title}
          </h3>
          <ArrowRight
            className="size-5 shrink-0 text-gray-700"
            aria-hidden="true"
          />
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
    <section className="overflow-hidden py-12 lg:py-24">
      <div className="container mb-10 lg:mb-16">
        <div className="flex items-end justify-between gap-8">
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-3">
              {eyebrow && (
                <p className="text-sm font-semibold text-brand-700">
                  {eyebrow}
                </p>
              )}
              <h2 className="text-display-md font-semibold tracking-display-md text-gray-900">
                {heading}
              </h2>
            </div>
            {subCopy && <p className="text-xl text-brand-500">{subCopy}</p>}
          </div>
          {(canScrollPrev || canScrollNext) && (
            <div className="hidden shrink-0 gap-6 md:flex">
              {canScrollPrev && (
                <button
                  type="button"
                  onClick={() => api?.scrollPrev()}
                  aria-label="Previous slide"
                  className="flex items-center justify-center rounded-full border border-brand-50 bg-off-white p-3.5 text-brand-700 hover:bg-brand-25"
                >
                  <ChevronLeft className="size-5" aria-hidden="true" />
                </button>
              )}
              {canScrollNext && (
                <button
                  type="button"
                  onClick={() => api?.scrollNext()}
                  aria-label="Next slide"
                  className="flex items-center justify-center rounded-full border border-brand-50 bg-off-white p-3.5 text-brand-700 hover:bg-brand-25"
                >
                  <ChevronRight className="size-5" aria-hidden="true" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="container overflow-visible">
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
