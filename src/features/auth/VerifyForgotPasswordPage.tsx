import { useEffect, useState } from 'react';
import {
  useLocation,
  useNavigate,
} from 'react-router-dom';

import { AuthLayout } from '@/components/layout';
import { VerificationCode } from '@/components/common/VerificationCode';

import {
  resendForgotPassword,
  verifyForgotPassword,
} from '@/lib/api/auth';

const FOOTER_ITEMS = [
  'FAQ',
  'Help Center',
  'Terms of Use',
  'Privacy',
];

export function VerifyForgotPasswordPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email ?? '';

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    if (!email) {
      navigate('/forgot-password', {
        replace: true,
      });
    }
  }, [email, navigate]);

  const handleVerify = async (
    pin: string,
  ) => {
    try {
      setError(null);

      const data =
        await verifyForgotPassword(
          email,
          pin,
        );

      navigate('/new-password', {
        state: {
          resetToken:
            data.resetToken,
        },
      });
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Verification failed.';

      setError(message);

      throw err;
    }
  };

  const handleResend =
    async () => {
      try {
        setError(null);

        await resendForgotPassword(
          email,
        );
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : 'Failed to resend code.';

        setError(message);

        throw err;
      }
    };

  return (
    <AuthLayout
      footer={
        <div className="flex flex-col gap-4">
          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-label-sm">
            {FOOTER_ITEMS.map(
              (item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="transition-colors hover:text-on-surface"
                  >
                    {item}
                  </a>
                </li>
              ),
            )}
          </ul>

          <select
            defaultValue="en"
            className="w-32 rounded-card border border-white/20 bg-black/40 px-3 py-1.5 text-label-sm text-on-surface"
          >
            <option value="en">
              English
            </option>

            <option value="es">
              Español
            </option>
          </select>
        </div>
      }
    >
      <VerificationCode
        title="Verify Password Reset"
        description="We sent a 4-digit verification code to"
        email={email}
        onVerify={handleVerify}
        onResend={handleResend}
        showSuccess={false}
        cancelLabel="Use another email"
        onCancel={() =>
          navigate('/forgot-password')
        }
      />

      {error && (
        <p className="mt-4 text-center text-sm text-red-500">
          {error}
        </p>
      )}
    </AuthLayout>
  );
}