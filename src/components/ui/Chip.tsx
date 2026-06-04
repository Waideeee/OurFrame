import type { ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface ChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
}

/** Pill filter/genre chip. Active state fills brand red. */
export function CategoryChip({ active = false, className, children, ...rest }: ChipProps) {
  return (
    <button
      type="button"
      aria-pressed={active}
      className={cn(
        'whitespace-nowrap rounded-full px-4 py-1.5 text-label-sm font-medium uppercase tracking-wide',
        'border transition-colors duration-200 ease-cinematic',
        active
          ? 'border-primary bg-primary text-white'
          : 'border-white/15 bg-white/10 text-on-surface hover:border-white/40 hover:bg-white/20',
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
