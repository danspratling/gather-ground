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

  function findMatchingVariant(sel: Record<string, string>) {
    return variants.find((v) =>
      Object.entries(sel).every(([key, val]) => v.selectedOptions[key] === val)
    );
  }

  /**
   * Values available for an option given current selections for all preceding
   * options. A value is available if at least one variant matches all preceding
   * selections AND has this value for the given option name.
   *
   * For the first option (index 0) there are no preceding selections, so all
   * values that appear in at least one variant are returned.
   */
  function getAvailableValues(optionIndex: number, optionName: string): string[] {
    const precedingSelections = Object.fromEntries(
      options
        .slice(0, optionIndex)
        .filter((o) => selections[o.name] !== undefined)
        .map((o) => [o.name, selections[o.name]])
    );

    return options[optionIndex].values
      .map((v) => v.name)
      .filter((valueName) =>
        variants.some(
          (variant) =>
            Object.entries(precedingSelections).every(
              ([k, val]) => variant.selectedOptions[k] === val
            ) && variant.selectedOptions[optionName] === valueName
        )
      );
  }

  function getValueState(
    optionName: string,
    valueName: string,
    available: boolean
  ): { unavailable: boolean; oos: boolean } {
    if (!available) return { unavailable: true, oos: false };
    const hypothetical = { ...selections, [optionName]: valueName };
    const match = findMatchingVariant(hypothetical);
    // No full match yet (downstream options not yet selected) — not OOS
    if (!match) return { unavailable: false, oos: false };
    return { unavailable: false, oos: match.inventoryStatus === 'out_of_stock' };
  }

  function handleSelect(
    optionName: string,
    valueName: string,
    optionIndex: number
  ) {
    const newSelections: Record<string, string> = {
      ...selections,
      [optionName]: valueName,
    };

    // Reset all downstream options — they may no longer be valid for the new selection
    for (const opt of options.slice(optionIndex + 1)) {
      delete newSelections[opt.name];
    }

    // Auto-select the first available value for each downstream option
    for (let i = optionIndex + 1; i < options.length; i++) {
      const opt = options[i];
      const precedingSelections = Object.fromEntries(
        options
          .slice(0, i)
          .filter((o) => newSelections[o.name] !== undefined)
          .map((o) => [o.name, newSelections[o.name]])
      );
      const firstAvailable = opt.values.find((v) =>
        variants.some(
          (variant) =>
            Object.entries(precedingSelections).every(
              ([k, val]) => variant.selectedOptions[k] === val
            ) && variant.selectedOptions[opt.name] === v.name
        )
      );
      if (firstAvailable) newSelections[opt.name] = firstAvailable.name;
    }

    setSelections(newSelections);

    const matched = findMatchingVariant(newSelections);
    if (matched) {
      const oos = matched.inventoryStatus === 'out_of_stock';
      window.dispatchEvent(
        new CustomEvent<{ variantId: string; price: Money; oos: boolean }>(
          'variant:selected',
          { bubbles: true, detail: { variantId: matched.id, price: matched.price, oos } }
        )
      );
      onVariantChange?.(matched);
    }
  }

  return (
    <div className={cn('flex flex-col gap-6', className)}>
      {options.map((option, optionIndex) => {
        const availableValues = getAvailableValues(optionIndex, option.name);

        // Hide entire option when nothing is available for the current selection
        // (e.g. "Smoked" doesn't appear when Belly is selected)
        if (availableValues.length === 0) return null;

        return (
          <div key={option.id} className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-gray-900">
              {option.name}
            </span>
            <div className="flex flex-wrap gap-2">
              {option.values.map((value) => {
                const isAvailable = availableValues.includes(value.name);

                // For options after the first, hide values that aren't available
                // given the current preceding selections rather than showing them
                // struck-through — they're not valid choices, not just OOS.
                if (optionIndex > 0 && !isAvailable) return null;

                const isSelected = selections[option.name] === value.name;
                const { unavailable, oos } = getValueState(
                  option.name,
                  value.name,
                  isAvailable
                );

                return (
                  <button
                    key={value.id}
                    type="button"
                    disabled={unavailable}
                    onClick={() =>
                      handleSelect(option.name, value.name, optionIndex)
                    }
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
        );
      })}
    </div>
  );
}
