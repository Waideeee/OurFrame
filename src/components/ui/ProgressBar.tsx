interface ProgressBarProps {
  progress: number;
}

export function ProgressBar({
  progress,
}: ProgressBarProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between text-sm text-metadata">
        <span>Uploading...</span>
        <span>{progress}%</span>
      </div>

      <div className="h-2 w-full overflow-hidden rounded-full bg-surface-high">
        <div
          className="h-full rounded-full bg-primary transition-all duration-200"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}