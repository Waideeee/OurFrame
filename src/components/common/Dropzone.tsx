import { useRef, useState, type DragEvent } from 'react';
import { UploadCloud, FileImage } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DropzoneProps {
  /** Called with the user's chosen files (no upload is performed — mock only). */
  onFiles?: (files: File[]) => void;
  accept?: string;
}

export function Dropzone({ onFiles, accept = 'video/mp4,image/jpeg,image/png' }: DropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [selected, setSelected] = useState<File[]>([]);

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList) return;
    const files = Array.from(fileList);
    setSelected(files);
    onFiles?.(files);
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={onDrop}
      role="button"
      tabIndex={0}
      onClick={() => inputRef.current?.click()}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && inputRef.current?.click()}
      aria-label="Select your media to upload"
      className={cn(
        'flex h-full min-h-[360px] cursor-pointer flex-col items-center justify-center gap-4 rounded-card p-8 text-center',
        'border-2 border-dashed transition-colors duration-200',
        isDragging
          ? 'border-primary bg-primary/5'
          : 'border-outline-variant bg-surface hover:border-outline',
      )}
    >
      <span className="rounded-full bg-surface-high p-5 text-primary-accent">
        <UploadCloud size={32} />
      </span>
      <div>
        <p className="text-title-md text-on-surface">Select your media</p>
        <p className="mt-1 text-body-md text-metadata">
          Drag &amp; drop or click to browse — MP4, JPG, PNG
        </p>
      </div>

      {selected.length > 0 ? (
        <ul className="mt-2 w-full max-w-sm space-y-1 text-left">
          {selected.map((file) => (
            <li
              key={file.name}
              className="flex items-center gap-2 rounded-card bg-surface-high px-3 py-2 text-label-sm text-on-surface"
            >
              <FileImage size={14} className="text-primary-accent" />
              <span className="truncate">{file.name}</span>
            </li>
          ))}
        </ul>
      ) : null}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  );
}
