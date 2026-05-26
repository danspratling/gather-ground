import { cn } from '@/lib/utils';
import type { ButtonSize, ButtonVariant } from './Button.types';

// Shared source of truth for Button styling. Imported by Button.astro and by
// React islands that need to render button-styled links/elements without
// pulling in an Astro component.

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  default:
    'bg-brand-700 border border-brand-600 text-brand-25 hover:bg-brand-600 disabled:bg-gray-100 disabled:border-0 disabled:text-gray-400',
  outline: 'bg-background border border-border text-foreground hover:bg-muted',
  ghost:
    'bg-transparent border border-transparent text-foreground hover:bg-muted hover:border-muted',
  link: 'text-foreground underline-offset-4 hover:underline',
};

const SIZE_CLASSES: Record<ButtonSize, { default: string; iconOnly: string }> =
  {
    sm: { default: 'px-3 py-2 text-sm', iconOnly: 'p-2 text-sm' },
    md: { default: 'px-3.5 py-2.5 text-sm', iconOnly: 'p-2.5 text-sm' },
    lg: { default: 'px-4.5 py-3 text-base', iconOnly: 'p-3 text-base' },
    xl: { default: 'px-5 py-3 text-base', iconOnly: 'p-3 text-base' },
  };

const BASE_CLASSES = [
  'inline-flex items-center justify-center gap-2 rounded-full font-semibold whitespace-nowrap transition-colors cursor-pointer',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-ring',
  'disabled:pointer-events-none disabled:opacity-50',
];

export interface ButtonClassesOptions {
  variant?: ButtonVariant;
  size?: ButtonSize;
  iconOnly?: boolean;
  className?: string;
}

export function buttonClasses({
  variant = 'default',
  size = 'md',
  iconOnly = false,
  className,
}: ButtonClassesOptions = {}): string {
  return cn(
    ...BASE_CLASSES,
    VARIANT_CLASSES[variant],
    SIZE_CLASSES[size][iconOnly ? 'iconOnly' : 'default'],
    className
  );
}

export default null;
