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
    optionIndex: number,
    optionName: string,
    valueName: string
  ): { unavailable: boolean; oos: boolean } {
    // Only use selections from options that precede this one so that a later
    // option's current value doesn't incorrectly rule out earlier options.
    const precedingSelections = Object.fromEntries(
      options
        .slice(0, optionIndex)
        .filter((o) => selections[o.name] !== undefined)
        .map((o) => [o.name, selections[o.name]])
    );
    const hypothetical = { ...precedingSelections, [optionName]: valueName };
    const match = findMatchingVariant(hypothetical);
    if (!match) return { unavailable: true, oos: false };
    return {
      unavailable: false,
      oos: match.inventoryStatus === 'out_of_stock',
    };
  }

  function handleSelect(optionName: string, valueName: string) {
    const optionIndex = options.findIndex((o) => o.name === optionName);
    const newSelections: Record<string, string> = {
      ...selections,
      [optionName]: valueName,
    };

    // Reset all downstream options so stale selections don't block later rows.
    // e.g. switching Cut from Belly (with Size=1kg) to Bacon clears Size so
    // Smoked can appear correctly.
    for (const opt of options.slice(optionIndex + 1)) {
      delete newSelections[opt.name];
    }

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
      {options.map((option, optionIndex) => {
        // Hide the entire option row when no values are available given
        // current preceding selections (e.g. hide Smoked when Belly is selected).
        const hasAnyAvailable = option.values.some((value) => {
          const precedingSelections = Object.fromEntries(
            options
              .slice(0, optionIndex)
              .filter((o) => selections[o.name] !== undefined)
              .map((o) => [o.name, selections[o.name]])
          );
          const hypothetical = {
            ...precedingSelections,
            [option.name]: value.name,
          };
          return findMatchingVariant(hypothetical) !== undefined;
        });
        if (!hasAnyAvailable) return null;

        return (
          <div key={option.id} className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-gray-900">
              {option.name}
            </span>
            <div className="flex flex-wrap gap-2">
              {option.values.map((value) => {
                const isSelected = selections[option.name] === value.name;
                const { unavailable, oos } = getOptionValueState(
                  optionIndex,
                  option.name,
                  value.name
                );

                // For options after the first, hide values that don't exist
                // for the current preceding selections (e.g. hide 500g/1kg when
                // Bacon is selected). The first option always shows all values
                // so the user can see what cuts exist.
                if (optionIndex > 0 && unavailable) return null;

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
                      unavailable &&
                        'cursor-not-allowed opacity-40 line-through',
                      !unavailable && oos && 'opacity-60'
                    )}
                  >
                    {value.name}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
