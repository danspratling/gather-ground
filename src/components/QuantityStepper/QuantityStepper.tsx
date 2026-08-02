import { useState } from 'react';
import { Minus, Plus } from '@untitledui-pro/icons/line';
import { cn } from '@/lib/utils';
import type { QuantityStepperProps } from '@/components/QuantityStepper/QuantityStepper.types';

export default function QuantityStepper({
  value,
  min = 1,
  max = 99,
  disabled = false,
  onChange,
  class: className,
}: QuantityStepperProps) {
  const [inputValue, setInputValue] = useState(String(value));

  const clamp = (n: number) => Math.min(Math.max(n, min), max);

  const handleDecrement = () => {
    const next = clamp(value - 1);
    setInputValue(String(next));
    onChange(next);
  };

  const handleIncrement = () => {
    const next = clamp(value + 1);
    setInputValue(String(next));
    onChange(next);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleBlur = () => {
    const parsed = parseInt(inputValue, 10);
    const next = Number.isNaN(parsed) ? min : clamp(parsed);
    setInputValue(String(next));
    onChange(next);
  };

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-lg border border-brand-100',
        disabled && 'opacity-50',
        className
      )}
    >
      <button
        type="button"
        aria-label="Decrease quantity"
        onClick={handleDecrement}
        disabled={disabled || value <= min}
        className="flex size-9 cursor-pointer items-center justify-center rounded-l-lg text-brand-700 transition-colors hover:bg-brand-50 disabled:cursor-not-allowed disabled:text-brand-300"
      >
        <Minus className="size-4" aria-hidden="true" />
      </button>

      <input
        type="number"
        inputMode="numeric"
        min={min}
        max={max}
        value={inputValue}
        disabled={disabled}
        onChange={handleInputChange}
        onBlur={handleBlur}
        className="w-10 border-x border-brand-100 bg-transparent py-2 text-center text-sm font-medium text-brand-700 outline-none disabled:cursor-not-allowed [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        aria-label="Quantity"
      />

      <button
        type="button"
        aria-label="Increase quantity"
        onClick={handleIncrement}
        disabled={disabled || value >= max}
        className="flex size-9 cursor-pointer items-center justify-center rounded-r-lg text-brand-700 transition-colors hover:bg-brand-50 disabled:cursor-not-allowed disabled:text-brand-300"
      >
        <Plus className="size-4" aria-hidden="true" />
      </button>
    </div>
  );
}
