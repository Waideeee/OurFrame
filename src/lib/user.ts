import { apiFetch } from './api';

export interface UserInfo {
  userId: string;
  firstName: string;
  partnerName: string;
  email: string;
  passwordChangedAt: string;
}

export interface StorageStats {
  used: number;
  limit: number;
  photos: number;
  videos: number;
  percentage: number;
}

export interface NotificationSettings {
  partnerAddsMemory: boolean;
  memoryGetsHeart: boolean;
  monthlyRecap: boolean;
  milestoneReminders: boolean;
  weeklyRecapEmail: boolean;
  ourframeUpdates: boolean;
}

export interface PrivacySettings {
  shareWithPartner: boolean;
  showLastActive: boolean;
  showWhoHearted: boolean;
  autoArchiveOld: boolean;
}

export async function getStorageStats() {
  return apiFetch<StorageStats>('/users/me/storage');
}

export async function getNotificationSettings(
  profileId: string,
) {
  return apiFetch<NotificationSettings>(
    `/users/me/notification?profileId=${profileId}`,
  );
}

export async function updateNotificationSettings(
  data: NotificationSettings & {
    profileId: string;
  },
) {
  return apiFetch<NotificationSettings>(
    `/users/me/notification`,
    {
      method: 'PATCH',
      body: data,
    },
  );
}

export async function getPrivacySettings(
  profileId: string,
) {
  return apiFetch<PrivacySettings>(
    `/users/me/privacy?profileId=${profileId}`,
  );
}

export async function updatePrivacySettings(
  data: PrivacySettings & {
    profileId: string;
  },
) {
  return apiFetch<PrivacySettings>(
    `/users/me/privacy`,
    {
      method: 'PATCH',
      body: data,
    },
  );
}


export async function getUserInfo() {
  return apiFetch<UserInfo>('/users/me');
}

export async function changeEmail(data: {
    newEmail: string;
    confirmEmail: string;
    currentPassword: string;
}) {
    return apiFetch(
        '/users/me/change-email',
        {
            method: 'PATCH',
            body: data,
        },
    );
}

export async function verifyEmailChange(data: {
  email: string;
  pin: string;
}) {
  return apiFetch('/users/me/change-email/verify', {
    method: 'POST',
    body: data,
  });
}

export async function resendEmailChangeVerification(
  email: string,
) {
  return apiFetch(
    '/users/me/change-email/resend',
    {
      method: 'POST',
      body: { email },
    },
  );
}

export async function changePassword(data:{
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}){
  return apiFetch(
    '/users/me/password',
    {
      method: 'PATCH',
      body: data,
    }
  );
}

