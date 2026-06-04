import { motion } from 'framer-motion';
import { Info, Play, Plus } from 'lucide-react';
import type { Memory } from '@/types';
import { formatDate } from '@/lib/utils';
import { Badge, Button } from '@/components/ui';
import type { ReactNode } from 'react';

interface HeroAction {
  label: string;
  icon?: ReactNode;
  variant?: 'primary' | 'secondary' | 'icon';
  onClick?: () => void;
  ariaLabel?: string;
}

interface HeroBannerProps {
  memory: Memory;
  /** Overrides the default Play / + Collection / Info action set. */
  actions?: HeroAction[];
  badgeLabel?: string;
  /** Show the capture date next to the badge (Videos page does this). */
  showDate?: boolean;
}

export function HeroBanner({
  memory,
  actions,
  badgeLabel = 'Featured',
  showDate = false,
}: HeroBannerProps) {
  const defaultActions: HeroAction[] = [
    { label: 'Play', icon: <Play size={18} className="fill-canvas" />, variant: 'primary' },
    { label: '+ Collection', icon: <Plus size={18} />, variant: 'secondary' },
    { label: '', icon: <Info size={20} />, variant: 'icon', ariaLabel: 'More information' },
  ];
  const resolvedActions = actions ?? defaultActions;

  return (
    <section className="relative h-[72vh] min-h-[520px] w-full overflow-hidden">
      <img
        src={memory.imageUrl}
        alt={memory.title}
        className="absolute inset-0 h-full w-full object-cover"
      />
      {/* Bottom + left vignette gradients keep text legible. */}
      <div className="absolute inset-0 bg-hero-vignette" />
      <div className="absolute inset-0 bg-hero-vignette-left" />

      <div className="container-edge relative flex h-full flex-col justify-end pb-[8%]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="max-w-2xl"
        >
          <div className="mb-4 flex items-center gap-3">
            <Badge tone="featured">{badgeLabel}</Badge>
            {showDate ? (
              <span className="text-label-sm uppercase tracking-widest text-metadata">
                {formatDate(memory.date)}
              </span>
            ) : null}
          </div>

          <h1 className="text-headline-mobile text-on-surface md:text-display-lg">{memory.title}</h1>

          <p className="mt-4 max-w-xl text-body-md text-metadata line-clamp-3">
            {memory.description}
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            {resolvedActions.map((action, i) => (
              <Button
                key={`${action.label}-${i}`}
                variant={action.variant ?? 'primary'}
                size="lg"
                leadingIcon={action.icon}
                onClick={action.onClick}
                aria-label={action.ariaLabel ?? action.label}
              >
                {action.label}
              </Button>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
