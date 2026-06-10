import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Mail } from 'lucide-react';
import { useProfile } from '@/app/providers';
import { Button, Input } from '@/components/ui';

const ACCOUNT_EMAIL_KEY = 'ourframe:account:email';

function defaultEmail(name: string | undefined): string {
  if (!name) return '';
  return `${name.toLowerCase().replace(/[^a-z0-9]/g, '')}@ourframe.love`;
}

function readStoredEmail(): string {
  try {
    return localStorage.getItem(ACCOUNT_EMAIL_KEY) ?? '';
  } catch {
    return '';
  }
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function ChangeEmailPage() {
  const navigate = useNavigate();
  const { activeProfile } = useProfile();

  const currentEmail = readStoredEmail() || defaultEmail(activeProfile?.name);

  const [newEmail, setNewEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');

    const next = newEmail.trim().toLowerCase();
    if (!EMAIL_RE.test(next)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (next === currentEmail.toLowerCase()) {
      setError('That’s already your current email.');
      return;
    }
    if (next !== confirmEmail.trim().toLowerCase()) {
      setError('The email addresses don’t match.');
      return;
    }
    if (!password) {
      setError('Enter your current password to confirm.');
      return;
    }

    try {
      localStorage.setItem(ACCOUNT_EMAIL_KEY, next);
    } catch {
      /* storage unavailable — still show success for this session */
    }
    setDone(true);
  };

  return (
    <div
      style={{ backgroundColor: 'var(--set-page)' }}
      className="flex min-h-screen flex-col items-center px-edge pt-24 pb-16"
    >
      <div className="w-full max-w-[480px]">
        <Link
          to="/settings"
          className="mb-6 inline-flex items-center gap-2 text-label-sm font-semibold uppercase tracking-widest text-metadata transition-colors hover:text-on-surface"
        >
          <ArrowLeft size={16} />
          Back to settings
        </Link>

        <div
          style={{ backgroundColor: 'var(--set-card)', border: '0.5px solid var(--set-border)' }}
          className="rounded-lg p-7"
        >
          {done ? (
            <div className="flex flex-col items-center gap-4 py-6 text-center">
              <CheckCircle2 size={48} className="text-primary" />
              <h1 className="text-title-md text-on-surface">Email updated</h1>
              <p className="text-body-md text-metadata">
                Your email is now <span className="text-on-surface">{newEmail.trim().toLowerCase()}</span>.
              </p>
              <Button variant="brand" size="lg" fullWidth onClick={() => navigate('/settings')}>
                Back to Settings
              </Button>
            </div>
          ) : (
            <>
              <div className="mb-6 flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-surface-high text-primary">
                  <Mail size={22} />
                </span>
                <div>
                  <h1 className="text-title-md text-on-surface">Change email</h1>
                  <p className="text-label-sm text-metadata">Update the address you sign in with</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <Input label="Current email" value={currentEmail} readOnly disabled />
                <Input
                  label="New email"
                  type="email"
                  placeholder="you@ourframe.love"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  autoComplete="email"
                  required
                />
                <Input
                  label="Confirm new email"
                  type="email"
                  placeholder="you@ourframe.love"
                  value={confirmEmail}
                  onChange={(e) => setConfirmEmail(e.target.value)}
                  required
                />
                <Input
                  label="Current password"
                  revealToggle
                  placeholder="Enter your password to confirm"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />

                {error ? <p className="text-label-sm text-primary">{error}</p> : null}

                <div className="mt-2 flex flex-col gap-3">
                  <Button type="submit" variant="brand" size="lg" fullWidth>
                    Save Changes
                  </Button>
                  <Link
                    to="/settings"
                    className="text-center text-label-sm font-semibold uppercase tracking-widest text-metadata transition-colors hover:text-on-surface"
                  >
                    Cancel
                  </Link>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
