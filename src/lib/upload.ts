import axios from 'axios';
import { apiFetch } from './api';

export async function uploadFile(
  file: File,
  onProgress?: (progress: number) => void,
): Promise<string> {
  const { uploadUrl, key } = await apiFetch<{
    uploadUrl: string;
    key: string;
  }>('/upload/presigned-url', {
    method: 'POST',
    body: {
      filename: file.name,
      contentType: file.type,
    },
  });

  await axios.put(uploadUrl, file, {
    headers: {
      'Content-Type': file.type,
    },

    onUploadProgress(progressEvent) {
      if (!progressEvent.total) return;

      const percent = Math.round(
        (progressEvent.loaded * 100) /
          progressEvent.total,
      );

      onProgress?.(percent);
    },
  });

  return `https://ourframe.dev/${key}`;
}