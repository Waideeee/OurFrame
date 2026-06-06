import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
}

export function SearchBar({
  value,
  onChange,
  placeholder = 'Search our frame…',
  className,
  autoFocus = false,
}: SearchBarProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-3 rounded-card bg-surface-high px-5',
        'border border-white/10 focus-within:border-white/30',
        'focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-0',
        className,
      )}
    >
      <Search className="shrink-0 text-metadata" size={22} />
      <input
        type="search"
        value={value}
        autoFocus={autoFocus}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label="Search memories"
        className="h-14 w-full bg-transparent text-body-md text-on-surface placeholder:text-metadata/70 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
      />
    </div>
  );
}
