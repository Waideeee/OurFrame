import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { AuthLayout } from '@/components/layout';
import { VerificationCode } from '@/components/common/VerificationCode';
import { apiFetch } from '@/lib/api';

export function VerifyEmailPage() {
  const navigate = useNavigate();
  
 const location = useLocation() as {
  state: { email?: string };
};

const email = location.state?.email ?? '';
  useEffect(() => {
  if (!email) {
    navigate('/login', { replace: true });
  }
}, [email, navigate]);

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
      <VerificationCode
        title="Verify Your Email"
        description="We sent a 4-digit verification code to"
        email={email}
        onVerify={handleVerify}
        onResend={handleResend}
        successTitle="Email Verified!"
        successDescription="Your email has been successfully confirmed."
        onContinue={() => navigate('/login')}
    />
    </AuthLayout>
  );
}