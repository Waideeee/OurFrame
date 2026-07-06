import { apiFetch } from './api';

export interface Notification {
  id: string;
  profileId: string;
  type: string;
  message: string;
  imageUrl: string | null;
  memoryId: string | null;
  isRead: boolean;
  createdAt: string;
}

export async function fetchNotifications(profileId: string): Promise<Notification[]> {
  return apiFetch<Notification[]>(`/notifications?profileId=${profileId}`);
}

export async function markNotificationRead(id: string): Promise<void> {
  return apiFetch(`/notifications/${id}/read`, { method: 'PATCH' });
}

export async function markAllNotificationsRead(profileId: string): Promise<void> {
  return apiFetch('/notifications/read', { 
    method: 'PATCH',
    body: { profileId }
  });
}

