interface UploadProgressProps {
  progress: number;
}

export function UploadProgress({
  progress,
}: UploadProgressProps) {
  return (
    <div className="w-full">
      <div className="h-2 overflow-hidden rounded-full bg-surface">
        <div
          className="h-full rounded-full bg-primary transition-all duration-200"
          style={{
            width: `${progress}%`,
          }}
        />
      </div>

      <p className="mt-2 text-center text-label-sm text-metadata">
        {progress}% uploaded
      </p>
    </div>
  );
}