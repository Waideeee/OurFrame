import { useNavigate, useLocation } from 'react-router-dom';
import { AuthLayout } from '@/components/layout';
import { EmailVerification } from '@/components/common/EmailVerification';
import { apiFetch } from '@/lib/api';

export function VerifyEmailPage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const email = (state as { email?: string })?.email ?? '';

  const handleVerify = async (pin: string) => {
    await apiFetch('/auth/verify-email', {
      method: 'POST',
      body: { email, pin },
    });
  };

  const handleResend = async () => {
    await apiFetch('/auth/resend-verification', {
      method: 'POST',
      body: { email },
    });
  };

  return (
    <AuthLayout>
      <EmailVerification
        email={email}
        onVerify={handleVerify}
        onResend={handleResend}
        onVerified={() => navigate('/profiles')}
        onCancel={() => navigate('/signup')}
      />
    </AuthLayout>
  );
}