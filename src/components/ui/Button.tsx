import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

export type ButtonVariant = 'primary' | 'secondary' | 'brand' | 'icon';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Icon rendered before the label (ignored for the `icon` variant). */
  leadingIcon?: ReactNode;
  fullWidth?: boolean;
}

const VARIANTS: Record<ButtonVariant, string> = {
  // Solid white bg / black text — the Netflix "Play" affordance.
  primary: 'bg-on-surface text-canvas hover:bg-white',
  // Translucent grey — secondary actions like "More Info".
  secondary: 'bg-[rgba(109,109,110,0.7)] text-on-surface hover:bg-[rgba(109,109,110,0.5)]',
  // Brand red — auth submits and primary CTAs.
  brand: 'bg-primary text-white hover:bg-primary/90',
  // Circular, thin white border — icon-only.
  icon: 'border border-white/50 text-on-surface hover:border-white hover:bg-white/10 rounded-full p-2.5 aspect-square',
};

const SIZES: Record<ButtonSize, string> = {
  sm: 'h-9 px-4 text-label-sm',
  md: 'h-11 px-6 text-body-md',
  lg: 'h-12 px-8 text-body-md',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = 'primary',
    size = 'md',
    leadingIcon,
    fullWidth = false,
    className,
    children,
    type = 'button',
    ...rest
  },
  ref,
) {
  const isIcon = variant === 'icon';
  return (
    <button
      ref={ref}
      type={type}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-card font-semibold',
        'transition duration-200 ease-cinematic active:scale-95',
        'disabled:pointer-events-none disabled:opacity-50',
        VARIANTS[variant],
        !isIcon && SIZES[size],
        fullWidth && 'w-full',
        className,
      )}
      {...rest}
    >
      {leadingIcon && !isIcon ? <span className="shrink-0">{leadingIcon}</span> : null}
      {children}
    </button>
  );
});
