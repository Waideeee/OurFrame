
import { cn } from '@/lib/utils';

export function CircleAction({
  active = false,
  label,
  onClick,
  children,
}: {
  active?: boolean;
  label: string;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={active}
      title={label}
      className={cn(
        'flex h-11 w-11 items-center justify-center rounded-full border transition-colors duration-200',
        active
          ? 'border-primary bg-primary text-white'
          : 'border-white/40 bg-black/40 text-on-surface hover:border-white hover:bg-white/10',
      )}
    >
      {children}
    </button>
  );
}