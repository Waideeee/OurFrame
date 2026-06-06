import { motion } from 'framer-motion';
import { Pencil, Plus } from 'lucide-react';
import type { Profile } from '@/types';
import { cn } from '@/lib/utils';

interface ProfileCardProps {
  profile: Profile;
  onSelect?: (profile: Profile) => void;
}

/** Square, 8px-rounded avatar used on the "Who's watching?" screen. */
export function ProfileCard({ profile, onSelect }: ProfileCardProps) {
  const isAdd = profile.kind === 'add';

  return (
    <motion.button
      type="button"
      onClick={() => onSelect?.(profile)}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.2 }}
      className="group flex flex-col items-center gap-3"
      aria-label={isAdd ? 'Add a profile' : `Select ${profile.name}`}
    >
      <span
        className={cn(
          'relative flex h-28 w-28 items-center justify-center overflow-hidden rounded-avatar md:h-36 md:w-36',
          'border-2 border-transparent transition-all duration-200',
          isAdd
            ? 'border-dashed border-outline-variant bg-surface text-metadata group-hover:border-on-surface group-hover:bg-surface-high group-hover:text-on-surface'
            : 'group-hover:border-on-surface',
        )}
      >
        {isAdd ? (
          <Plus size={40} className="transition-transform duration-200 group-hover:scale-110" />
        ) : (
          <>
            <img
              src={profile.avatarUrl}
              alt=""
              className="h-full w-full object-cover transition-all duration-200 group-hover:brightness-50"
            />
            {/* Manage-mode edit affordance, revealed on hover. */}
            <span className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-200 group-hover:opacity-100">
              <Pencil size={28} className="text-on-surface" />
            </span>
          </>
        )}
      </span>
      <span
        className={cn(
          'text-body-md text-metadata transition-all duration-200 group-hover:text-on-surface',
          isAdd && 'group-hover:font-semibold',
        )}
      >
        {profile.name}
      </span>
    </motion.button>
  );
}
