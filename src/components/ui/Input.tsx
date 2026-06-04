import { forwardRef, useId, useState, type InputHTMLAttributes, type ReactNode } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  /** Renders a SHOW/HIDE toggle and manages text/password swapping. */
  revealToggle?: boolean;
  trailing?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, revealToggle = false, trailing, type = 'text', className, id, ...rest },
  ref,
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const [revealed, setRevealed] = useState(false);
  const resolvedType = revealToggle ? (revealed ? 'text' : 'password') : type;

  return (
    <div className="flex flex-col gap-1.5">
      {label ? (
        <label htmlFor={inputId} className="text-label-sm font-medium text-metadata">
          {label}
        </label>
      ) : null}
      <div className="relative">
        <input
          ref={ref}
          id={inputId}
          type={resolvedType}
          className={cn(
            'h-12 w-full rounded-card bg-surface-high px-4 text-body-md text-on-surface',
            'placeholder:text-metadata/70',
            'border border-transparent transition-colors duration-200',
            'focus:border-outline focus:bg-surface-container focus:outline-none',
            (revealToggle || trailing) && 'pr-16',
            className,
          )}
          {...rest}
        />
        {revealToggle ? (
          <button
            type="button"
            onClick={() => setRevealed((v) => !v)}
            aria-label={revealed ? 'Hide password' : 'Show password'}
            className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-1 text-label-sm font-semibold uppercase tracking-wide text-metadata hover:text-on-surface"
          >
            {revealed ? <EyeOff size={16} /> : <Eye size={16} />}
            <span className="hidden sm:inline">{revealed ? 'Hide' : 'Show'}</span>
          </button>
        ) : (
          trailing
        )}
      </div>
    </div>
  );
});
