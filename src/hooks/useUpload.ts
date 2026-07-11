import { useCallback, useState } from 'react';
import { uploadFile as upload } from '@/lib/upload';

export function useUpload() {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('');
  const [isUploading, setUploading] = useState(false);

  const uploadFile = useCallback(
  async (
    file: File,
    start = 0,
    end = 100
  ) => {
    setUploading(true);

    try {
      const url = await upload(file, (fileProgress) => {
        const overall =
          start + ((end - start) * fileProgress) / 100;

        setProgress(Math.round(overall));
      });

      return url;
    } finally {
      // hindi muna natin sini-set false dito
      // kasi baka may next upload pa (cover photo)
    }
  },
  []
);

  const reset = useCallback(() => {
    setUploading(false);
    setProgress(0);
    setStatus('');
  }, []);

  const begin = useCallback(() => {
    setUploading(true);
    setProgress(0);
}, []);

const finish = useCallback(() => {
    setProgress(100);
    setStatus('Done!');
}, []);

  return {
    uploadFile,
    progress,
    setProgress,
    status,
    setStatus,
    isUploading,
    reset,
    begin,
    finish,
  };
}