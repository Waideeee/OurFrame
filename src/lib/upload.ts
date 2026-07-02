import { apiFetch } from './api';

export async function uploadFile(file: File): Promise<string> {
  const { uploadUrl, key } = await apiFetch<{ uploadUrl: string; key: string }>('/upload/presigned-url', {
    method: 'POST',
    body: { filename: file.name, contentType: file.type },
  });

  const putResponse = await fetch(uploadUrl, {
    method: 'PUT',
    headers: { 'Content-Type': file.type },
    body: file,
  });

  if (!putResponse.ok) {
    throw new Error('Failed to upload file to storage');
  }

  return `https://ourframe.dev/${key}`;
}