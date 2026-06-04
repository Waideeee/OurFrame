import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

type BadgeTone = 'featured' | 'neutral' | 'brand';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
}

const TONES: Record<BadgeTone, string> = {
  featured: 'bg-primary text-white',
  neutral: 'bg-black/60 text-on-surface backdrop-blur-sm',
  brand: 'border border-primary text-primary',
};

/** Small uppercase label used for "FEATURED" / metadata flags. */
export function Badge({ tone = 'featured', className, children, ...rest }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-sm px-2 py-0.5 text-label-sm font-semibold uppercase tracking-widest',
        TONES[tone],
        className,
      )}
      {...rest}
    >
      {children}
    </span>
  );
}
