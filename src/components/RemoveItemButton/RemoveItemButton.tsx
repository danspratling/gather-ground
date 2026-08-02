import { Trash01 } from '@untitledui-pro/icons/line';
import { cn } from '@/lib/utils';
import type { RemoveItemButtonProps } from '@/components/RemoveItemButton/RemoveItemButton.types';

export default function RemoveItemButton({
  onRemove,
  isLoading = false,
  class: className,
}: RemoveItemButtonProps) {
  return (
    <button
      type="button"
      aria-label="Remove item"
      onClick={onRemove}
      disabled={isLoading}
      className={cn(
        'flex size-8 cursor-pointer items-center justify-center rounded text-brand-500 transition-colors hover:bg-error-50 hover:text-error-700 disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
    >
      {isLoading ? (
        <span
          className="block size-4 animate-spin rounded-full border-2 border-brand-200 border-t-brand-700"
          aria-hidden="true"
        />
      ) : (
        <Trash01 className="size-4" aria-hidden="true" />
      )}
    </button>
  );
}
