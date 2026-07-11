import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { AuthLayout } from '@/components/layout';
import { Button, Input } from '@/components/ui';

import { forgotPassword } from '@/lib/api/auth';

const FOOTER_ITEMS = [
  'FAQ',
  'Help Center',
  'Terms of Use',
  'Privacy',
];

export function ForgotPasswordPage() {
  const navigate = useNavigate();

  const [error, setError] =
    useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const handleSubmit = async (
    e: FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();

    setError(null);

    const formData = new FormData(
      e.currentTarget,
    );

    const email = formData.get(
      'email',
    ) as string;

    try {
      setIsSubmitting(true);

      await forgotPassword(email);

      navigate(
        '/verify-forgot-password',
        {
          state: { email },
        },
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Something went wrong',
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
      <h1 className="text-headline-lg text-on-surface">
        Forgot Password
      </h1>

      <p className="mt-3 text-body-md text-metadata">
        Enter the email associated with your
        account and we'll send you a
        verification code.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-7 flex flex-col gap-4"
      >
        <Input
          label="Email"
          type="email"
          name="email"
          required
          autoComplete="email"
          placeholder="you@ourframe.love"
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
            ? 'Sending...'
            : 'Send Verification Code'}
        </Button>
      </form>

      <p className="mt-8 text-body-md text-metadata">
        Remember your password?{' '}
        <Link
          to="/login"
          className="font-semibold text-on-surface hover:underline"
        >
          Back to Sign In
        </Link>
      </p>
    </AuthLayout>
  );
}