import { apiFetch } from '@/lib/api';

export async function forgotPassword(email: string) {
  return apiFetch('/auth/forgot-password', {
    method: 'POST',
    body: { email },
  });
}

export async function resendForgotPassword(email: string) {
  return apiFetch('/auth/resend-forgot-password-verification', {
    method: 'POST',
    body: { email },
  });
}

interface VerifyForgotPasswordResponse {
  message: string;
  resetToken: string;
}

export async function verifyForgotPassword(
  email: string,
  pin: string,
): Promise<VerifyForgotPasswordResponse> {
  return apiFetch('/auth/verify-forgot-password', {
    method: 'POST',
    body: {
      email,
      pin,
    },
  });
}
export async function resetPassword(
  resetToken: string,
  newPassword: string,
  confirmPassword: string,
) {
  return apiFetch('/auth/reset-password', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${resetToken}`,
    },
    body: {
      newPassword,
      confirmPassword
    },
  });
}