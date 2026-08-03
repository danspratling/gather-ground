import { useState } from 'react';
import { cn } from '@/lib/utils';
import VariantPicker from '@/components/VariantPicker/VariantPicker';
import AddToCartButton from '@/components/Forms/AddToCartButton/AddToCartButton';
import type { Variant } from '@/lib/commerce/types';
import type { ProductDetailProps } from './ProductDetail.types';

export default function ProductDetail({
  title,
  description,
  images,
  options,
  variants,
  selectedVariantId,
  class: className,
}: ProductDetailProps) {
  const defaultVariant =
    variants.find((v) => v.id === selectedVariantId) ?? variants[0];

  const [selectedVariant, setSelectedVariant] = useState<Variant | undefined>(
    defaultVariant
  );

  const displayVariant = selectedVariant ?? defaultVariant;
  const firstImage = images[0];

  return (
    <div
      className={cn(
        'grid grid-cols-1 gap-8 lg:grid-cols-5 lg:gap-12',
        className
      )}
    >
      {/* Image — full width mobile, 60% desktop */}
      <div className="lg:col-span-3">
        {firstImage ? (
          <img
            src={firstImage.url}
            alt={firstImage.altText ?? title}
            className="aspect-square w-full rounded-2xl object-cover"
            width={800}
            height={800}
            loading="eager"
          />
        ) : (
          <div className="flex aspect-square w-full items-center justify-center rounded-2xl bg-secondary-100">
            <span className="text-sm text-secondary-400">
              No image available
            </span>
          </div>
        )}
      </div>

      {/* Info — full width mobile, 40% desktop */}
      <div className="flex flex-col gap-6 lg:col-span-2">
        <div className="flex flex-col gap-3">
          <h1 className="text-display-sm font-semibold text-brand-900 lg:text-display-md lg:tracking-display-md">
            {title}
          </h1>
          {description && (
            <p className="text-base text-brand-500">{description}</p>
          )}
        </div>

        <p className="text-display-xs font-semibold text-brand-900">
          {displayVariant?.price.formatted ?? ''}
        </p>

        {options.length > 0 && (
          <VariantPicker
            options={options}
            variants={variants}
            selectedVariantId={displayVariant?.id}
            onVariantChange={setSelectedVariant}
          />
        )}

        <AddToCartButton
          variantId={displayVariant?.id ?? ''}
          inventoryStatus={displayVariant?.inventoryStatus ?? 'out_of_stock'}
        />
      </div>
    </div>
  );
}
