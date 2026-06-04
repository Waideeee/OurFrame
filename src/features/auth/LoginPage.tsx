import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthLayout } from '@/components/layout';
import { Button, Input } from '@/components/ui';

const FOOTER_ITEMS = ['FAQ', 'Help Center', 'Terms of Use', 'Privacy'];

export function LoginPage() {
  const navigate = useNavigate();
  const [remember, setRemember] = useState(true);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Mock auth — go straight to profile selection.
    navigate('/profiles');
  };

  return (
    <AuthLayout
      footer={
        <div className="flex flex-col gap-4">
          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-label-sm">
            {FOOTER_ITEMS.map((item) => (
              <li key={item}>
                <a href="#" className="transition-colors hover:text-on-surface">
                  {item}
                </a>
              </li>
            ))}
          </ul>
          <select
            aria-label="Language"
            className="w-32 rounded-card border border-white/20 bg-black/40 px-3 py-1.5 text-label-sm text-on-surface"
            defaultValue="en"
          >
            <option value="en">English</option>
            <option value="es">Español</option>
          </select>
        </div>
      }
    >
      <h1 className="text-headline-lg text-on-surface">Sign In</h1>

      <form onSubmit={handleSubmit} className="mt-7 flex flex-col gap-4">
        <Input label="Email" type="email" placeholder="you@ourframe.love" required autoComplete="email" />
        <Input label="Password" revealToggle placeholder="Password" required autoComplete="current-password" />

        <Button type="submit" variant="brand" size="lg" fullWidth className="mt-2">
          Sign In
        </Button>

        <div className="flex items-center justify-between text-label-sm text-metadata">
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="h-4 w-4 accent-primary"
            />
            Remember me
          </label>
          <a href="#" className="transition-colors hover:text-on-surface">
            Forgot Password?
          </a>
        </div>
      </form>

      <p className="mt-8 text-body-md text-metadata">
        New to OurFrame?{' '}
        <Link to="/signup" className="font-semibold text-on-surface hover:underline">
          Sign up now.
        </Link>
      </p>
    </AuthLayout>
  );
}
