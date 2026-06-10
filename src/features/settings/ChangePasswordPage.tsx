import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, KeyRound } from 'lucide-react';
import { Button, Input } from '@/components/ui';

const PASSWORD_CHANGED_KEY = 'ourframe:account:passwordChangedAt';

export function ChangePasswordPage() {
  const navigate = useNavigate();

  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!current) {
      setError('Enter your current password.');
      return;
    }
    if (next.length < 8) {
      setError('Your new password must be at least 8 characters.');
      return;
    }
    if (next === current) {
      setError('Your new password must be different from the current one.');
      return;
    }
    if (next !== confirm) {
      setError('The new passwords don’t match.');
      return;
    }

    try {
      localStorage.setItem(PASSWORD_CHANGED_KEY, new Date().toISOString());
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
              <h1 className="text-title-md text-on-surface">Password updated</h1>
              <p className="text-body-md text-metadata">
                Your password was changed successfully.
              </p>
              <Button variant="brand" size="lg" fullWidth onClick={() => navigate('/settings')}>
                Back to Settings
              </Button>
            </div>
          ) : (
            <>
              <div className="mb-6 flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-surface-high text-primary">
                  <KeyRound size={22} />
                </span>
                <div>
                  <h1 className="text-title-md text-on-surface">Change password</h1>
                  <p className="text-label-sm text-metadata">Keep your frame secure</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <Input
                  label="Current password"
                  revealToggle
                  placeholder="Enter current password"
                  value={current}
                  onChange={(e) => setCurrent(e.target.value)}
                  autoComplete="current-password"
                  required
                />
                <Input
                  label="New password"
                  revealToggle
                  placeholder="At least 8 characters"
                  value={next}
                  onChange={(e) => setNext(e.target.value)}
                  autoComplete="new-password"
                  required
                />
                <Input
                  label="Confirm new password"
                  revealToggle
                  placeholder="Re-enter new password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  autoComplete="new-password"
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
