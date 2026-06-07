import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

/**
 * tailwind-merge configured with OurFrame's custom font-size tokens so it stops
 * mistaking `text-body-md` (a font size) for a text-color utility — otherwise it
 * would strip color classes like `text-canvas` that share the `text-` prefix.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [
        { text: ['display-lg', 'headline-lg', 'headline-mobile', 'title-md', 'body-md', 'label-sm'] },
      ],
    },
  },
});

/** Merge conditional class names and de-dupe conflicting Tailwind utilities. */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/** "2024-07-12" -> "Jul 12, 2024". */
export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/** "2024-07-12" -> "July 2024". */
export function formatMonthYear(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
}

/** Video file extensions used to auto-detect uploaded media type. */
const VIDEO_EXTENSIONS = ['mp4', 'mov', 'webm', 'mkv', 'avi', 'm4v'];

/**
 * Auto-detect whether a file is a photo or a video from its name/extension.
 * Defaults to 'photo' when the extension is unknown.
 */
export function detectMediaType(fileName: string): 'photo' | 'video' {
  const ext = fileName.split('.').pop()?.toLowerCase() ?? '';
  return VIDEO_EXTENSIONS.includes(ext) ? 'video' : 'photo';
}

/** 5025 -> "1:23:45", 185 -> "3:05". */
export function formatDuration(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);
  const pad = (n: number) => n.toString().padStart(2, '0');
  return hours > 0 ? `${hours}:${pad(minutes)}:${pad(seconds)}` : `${minutes}:${pad(seconds)}`;
}
