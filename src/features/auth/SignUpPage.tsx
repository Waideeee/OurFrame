import { type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthLayout } from '@/components/layout';
import { Button, Input } from '@/components/ui';

export function SignUpPage() {
  const navigate = useNavigate();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    navigate('/profiles');
  };

  return (
    <AuthLayout>
      <h1 className="text-headline-lg text-on-surface">Unlimited Memories.</h1>
      <p className="mt-2 text-body-md text-metadata">
        Start archiving your journey together.
      </p>

      <form onSubmit={handleSubmit} className="mt-7 flex flex-col gap-4">
        <Input label="First Name" placeholder="Your name" required autoComplete="given-name" />
        <Input label="Partner's Name" placeholder="Their name" required />
        <Input label="Email" type="email" placeholder="you@ourframe.love" required autoComplete="email" />
        <Input label="Create Password" revealToggle placeholder="Create a password" required autoComplete="new-password" />

        <Button type="submit" variant="brand" size="lg" fullWidth className="mt-2">
          Get Started
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
