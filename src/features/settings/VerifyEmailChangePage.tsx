import { useEffect } from 'react';
import {
  useLocation,
  useNavigate,
} from 'react-router-dom';

import { VerificationCode } from '@/components/common/VerificationCode';

import {
  resendEmailChangeVerification,
  verifyEmailChange,
} from '@/lib/user';

export function VerifyEmailChangePage() {
  const navigate = useNavigate();
  const location = useLocation();

  const email =
    location.state?.email ?? '';

  useEffect(() => {
    if (!email) {
      navigate('/settings/change-email', {
        replace: true,
      });
    }
  }, [email, navigate]);

  const handleVerify = async (
    pin: string,
  ) => {
    await verifyEmailChange({
      email,
      pin,
    });
  };

  const handleResend =
    async () => {
      await resendEmailChangeVerification(
        email,
      );
    };

  return (
    <div
      style={{
        backgroundColor:
          'var(--set-page)',
      }}
      className="flex min-h-screen flex-col items-center px-edge pt-24 pb-16"
    >
      <div className="w-full max-w-[480px]">
        <div
          style={{
            backgroundColor:
              'var(--set-card)',
            border:
              '0.5px solid var(--set-border)',
          }}
          className="rounded-lg p-7"
        >
          <VerificationCode
            title="Verify Your New Email"
            description="We sent a 4-digit verification code to"
            email={email}
            onVerify={handleVerify}
            onResend={handleResend}
            successTitle="Email Updated!"
            successDescription="Your email has been updated successfully."
            onContinue={() =>
              navigate('/settings', {
                state: {
                  success:
                    'Your email has been updated successfully.',
                },
              })
            }
            onCancel={() =>
              navigate(
                '/settings/change-email',
              )
            }
            cancelLabel="Back"
          />
        </div>
      </div>
    </div>
  );
}