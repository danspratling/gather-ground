import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

/**
 * tailwind-merge doesn't know about custom `text-display-*` font-size utilities
 * (from @theme in global.css) and incorrectly treats them as the same group as
 * `text-{color}` utilities, stripping whichever appears first.
 * Registering them explicitly fixes the merge conflict.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': ['text-display-xl', 'text-display-lg', 'text-display-md'],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
