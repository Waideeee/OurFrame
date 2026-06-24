import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthLayout } from '@/components/layout';
import { Button, Input } from '@/components/ui';
import { useAuth } from '@/app/providers';

export function SignUpPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);
    const firstName = formData.get('firstName') as string;
    const partnerName = formData.get('partnerName') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;
    const rawDate = formData.get('relationshipStartDate') as string;
    const anniversaryDate = new Date(rawDate).toISOString();

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      setIsSubmitting(true);
      await register({
        firstName,
        partnerName,
        email,
        password,
        confirmPassword,
        anniversaryDate,
      });
      navigate('/profiles');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout>
      <h1 className="text-headline-lg text-on-surface">Unlimited Memories.</h1>
      <p className="mt-2 text-body-md text-metadata">
        Start archiving your journey together.
      </p>

      <form onSubmit={handleSubmit} className="mt-7 flex flex-col gap-4">
        <Input label="First Name" name="firstName" placeholder="Your name" required autoComplete="given-name" />
        <Input label="Partner's Name" name="partnerName" placeholder="Their name" required />
        <Input label="Email" name="email" type="email" placeholder="you@ourframe.love" required autoComplete="email" />
        <Input label="Create Password" name="password" revealToggle placeholder="Create a password" required autoComplete="new-password" />
        <Input label="Confirm Password" name="confirmPassword" revealToggle placeholder="Confirm your password" required autoComplete="new-password" />
        <Input
          label="When did your story begin? (Anniversary)"
          name="relationshipStartDate"
          type="date"
          required
          autoComplete="off"
          className="[color-scheme:dark]"
        />

        {error && <p className="text-sm text-red-500">{error}</p>}

        <Button type="submit" variant="brand" size="lg" fullWidth className="mt-2" disabled={isSubmitting}>
          {isSubmitting ? 'Creating account...' : 'Get Started'}
        </Button>
      </form>

      <p className="mt-8 text-body-md text-metadata">
        Already have an account?{' '}
        <Link to="/login" className="font-semibold text-on-surface hover:underline">
          Sign in.
        </Link>
      </p>
    </AuthLayout>
  );
}