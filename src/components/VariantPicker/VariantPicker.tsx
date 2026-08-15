import { useState } from 'react';
import { cn } from '@/lib/utils';
import type { Money } from '@/lib/commerce/types';
import type { VariantPickerProps } from '@/components/VariantPicker/VariantPicker.types';

export default function VariantPicker({
  options,
  variants,
  selectedVariantId,
  onVariantChange,
  class: className,
}: VariantPickerProps) {
  const initialVariant =
    variants.find((v) => v.id === selectedVariantId) ?? variants[0];
  const initialSelections: Record<string, string> = initialVariant
    ? { ...initialVariant.selectedOptions }
    : {};

  const [selections, setSelections] =
    useState<Record<string, string>>(initialSelections);

  function findMatchingVariant(newSelections: Record<string, string>) {
    return variants.find((v) =>
      Object.entries(newSelections).every(
        ([key, val]) => v.selectedOptions[key] === val
      )
    );
  }

  function getOptionValueState(
    optionName: string,
    valueName: string
  ): { unavailable: boolean; oos: boolean } {
    const hypothetical = { ...selections, [optionName]: valueName };
    const match = findMatchingVariant(hypothetical);
    if (!match) return { unavailable: true, oos: false };
    return {
      unavailable: false,
      oos: match.inventoryStatus === 'out_of_stock',
    };
  }

  function handleSelect(optionName: string, valueName: string) {
    const newSelections = { ...selections, [optionName]: valueName };
    setSelections(newSelections);

    const matched = findMatchingVariant(newSelections);
    if (matched) {
      const oos = matched.inventoryStatus === 'out_of_stock';
      const event = new CustomEvent<{
        variantId: string;
        price: Money;
        oos: boolean;
      }>('variant:selected', {
        bubbles: true,
        detail: { variantId: matched.id, price: matched.price, oos },
      });
      window.dispatchEvent(event);
      onVariantChange?.(matched);
    }
  }

  return (
    <div className={cn('flex flex-col gap-6', className)}>
      {options.map((option) => (
        <div key={option.id} className="flex flex-col gap-2">
          <span className="text-sm font-semibold text-gray-900">
            {option.name}
          </span>
          <div className="flex flex-wrap gap-2">
            {option.values.map((value) => {
              const isSelected = selections[option.name] === value.name;
              const { unavailable, oos } = getOptionValueState(
                option.name,
                value.name
              );

              return (
                <button
                  key={value.id}
                  type="button"
                  disabled={unavailable}
                  onClick={() => handleSelect(option.name, value.name)}
                  aria-pressed={isSelected}
                  aria-label={
                    unavailable
                      ? `${value.name} — unavailable`
                      : oos
                        ? `${value.name} — out of stock`
                        : value.name
                  }
                  className={cn(
                    'rounded-md border px-3 py-1.5 text-sm font-medium transition-colors',
                    isSelected
                      ? 'border-brand-700 bg-brand-700 text-brand-25'
                      : 'border-secondary-400 bg-secondary-50 text-brand-700 hover:border-brand-700 hover:bg-secondary-100',
                    unavailable && 'cursor-not-allowed opacity-40 line-through',
                    !unavailable && oos && 'opacity-60'
                  )}
                >
                  {value.name}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
