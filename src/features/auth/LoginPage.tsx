import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthLayout } from '@/components/layout';
import { Button, Input } from '@/components/ui';
import { useAuth } from '@/app/providers'; 


const FOOTER_ITEMS = ['FAQ', 'Help Center', 'Terms of Use', 'Privacy'];

export function LoginPage() {
  const navigate = useNavigate();
  const {login} = useAuth();
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);


  const  handleSubmit =  async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
   
    

    try {

      setIsSubmitting(true)

      await login({email,password})

      navigate('/profiles');

    } catch (err) {

      const msg = err instanceof Error ? err.message : 'Something went wrong';
      if (msg.includes('verify your email')) {
        navigate('/verify-email', { state: { email } });
      } else {
        setError(msg);
      }
      
    }finally{

      setIsSubmitting(false)
    }



    

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
        <Input label="Email" type="email" placeholder="you@ourframe.love" required autoComplete="email"  name="email"/>
        <Input label="Password" revealToggle placeholder="Password" required autoComplete="current-password" name="password" />
        {error && <p className="text-sm text-red-500">{error}</p>}

        <Button type="submit" variant="brand" size="lg" fullWidth className="mt-2" disabled={isSubmitting}>
          {isSubmitting ? 'Signing in...' : 'Sign In'}
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
