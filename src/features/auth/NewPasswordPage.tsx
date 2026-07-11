import { useEffect, useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { AuthLayout } from '@/components/layout';
import { Button, Input } from '@/components/ui';

import { resetPassword } from '@/lib/api/auth';

const FOOTER_ITEMS = [
  'FAQ',
  'Help Center',
  'Terms of Use',
  'Privacy',
];

export function NewPasswordPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const resetToken =
    location.state?.resetToken ?? '';

  const [password, setPassword] =
    useState('');

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState('');

  const [error, setError] =
    useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

    useEffect(() => {
  if (!resetToken) {
    navigate('/forgot-password', {
      replace: true,
    });
  }
}, [resetToken, navigate]);

  const handleSubmit = async (
    e: FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();

    setError(null);

    try {
      setIsSubmitting(true);

      await resetPassword(
        resetToken,
        password,
        confirmPassword,
      );

      navigate('/login');
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to reset password.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      footer={
        <div className="flex flex-col gap-4">
          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-label-sm">
            {FOOTER_ITEMS.map((item) => (
              <li key={item}>
                <a
                  href="#"
                  className="transition-colors hover:text-on-surface"
                >
                  {item}
                </a>
              </li>
            ))}
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
      <h1 className="text-headline-lg text-on-surface">
        Create New Password
      </h1>

      <p className="mt-3 text-body-md text-metadata">
        Your new password must be different
        from your previous password.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-7 flex flex-col gap-4"
      >
        <Input
          label="New Password"
          revealToggle
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          required
        />

        <Input
          label="Confirm Password"
          revealToggle
          value={confirmPassword}
          onChange={(e) =>
            setConfirmPassword(
              e.target.value,
            )
          }
          required
        />

        {error && (
          <p className="text-sm text-red-500">
            {error}
          </p>
        )}

        <Button
          type="submit"
          variant="brand"
          size="lg"
          fullWidth
          className="mt-2"
          disabled={isSubmitting}
        >
          {isSubmitting
            ? 'Updating Password...'
            : 'Reset Password'}
        </Button>
      </form>

      <p className="mt-8 text-body-md text-metadata">
        Remember your password?{' '}
        <Link
          to="/login"
          className="font-semibold text-on-surface hover:underline"
        >
          Sign In
        </Link>
      </p>
    </AuthLayout>
  );
}