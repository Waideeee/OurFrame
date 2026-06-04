import { Clapperboard } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { APP_NAME } from '@/lib/constants';

/** Red "OurFrame" wordmark with a clapperboard glyph. */
export function Logo({ className }: { className?: string }) {
  return (
    <Link to="/" className={cn('flex items-center gap-2', className)} aria-label={`${APP_NAME} home`}>
      <Clapperboard className="text-primary" size={26} strokeWidth={2.4} />
      <span className="text-title-md font-extrabold uppercase tracking-tight text-primary">
        {APP_NAME}
      </span>
    </Link>
  );
}
