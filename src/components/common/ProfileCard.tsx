import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
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
          'flex h-28 w-28 items-center justify-center overflow-hidden rounded-avatar md:h-36 md:w-36',
          'border-2 border-transparent transition-colors duration-200',
          isAdd
            ? 'border-dashed border-outline-variant bg-surface text-metadata group-hover:border-outline group-hover:text-on-surface'
            : 'group-hover:border-on-surface',
        )}
      >
        {isAdd ? (
          <Plus size={40} />
        ) : (
          <img src={profile.avatarUrl} alt="" className="h-full w-full object-cover" />
        )}
      </span>
      <span className="text-body-md text-metadata transition-colors group-hover:text-on-surface">
        {profile.name}
      </span>
    </motion.button>
  );
}
