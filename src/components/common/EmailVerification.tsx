import {
  useEffect,
  useRef,
  useState,
  type ClipboardEvent,
  type KeyboardEvent,
} from 'react';
import { motion, useAnimationControls } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui';
import { cn } from '@/lib/utils';

const PIN_LENGTH = 4;
/** Seconds the "Resend code" link stays disabled after a click. */
const RESEND_COOLDOWN = 30;

interface EmailVerificationProps {
  email: string;
  onVerify: (pin: string) => Promise<void>;   // ← palitan ng correctPin
  onResend: () => Promise<void>;               // ← palitan ng handleResend mock
  onVerified?: () => void;
  onContinue?: () => void;
  onCancel?: () => void;
  cancelLabel?: string;
  showSuccess?: boolean;
}

/**
 * Email confirmation via a 6-digit PIN. Self-contained (no page/card wrapper) so
 * it drops into any container — auth card, settings card, etc. PIN generation is
 * mocked: any code equal to `correctPin` (default "123456") verifies.
 */
export function EmailVerification({
  email,
  onVerified,
  onContinue,
  onCancel,
  onVerify,
  cancelLabel = 'Back',
  showSuccess = true,
  onResend,
}: EmailVerificationProps) {
  const [digits, setDigits] = useState<string[]>(() => Array(PIN_LENGTH).fill(''));
  const [error, setError] = useState(false);
  const [verified, setVerified] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [isVerifying, setIsVerifying] = useState(false);

  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
  const shake = useAnimationControls();

  // Auto-focus the first box on mount.
  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  // Count the resend cooldown down to zero, one second at a time.
  useEffect(() => {
    if (cooldown <= 0) return;
    const id = window.setInterval(() => setCooldown((c) => (c <= 1 ? 0 : c - 1)), 1000);
    return () => window.clearInterval(id);
  }, [cooldown]);

  const focusBox = (i: number) => inputsRef.current[i]?.focus();

  const submit = async (pin: string) => {
     if (isVerifying) return;

    setIsVerifying(true);
    try {
        await onVerify(pin);
        setError(false);
        onVerified?.();
        if (showSuccess) setVerified(true);


    } catch (err) {
        console.error(err);
        setError(true);
        void shake.start({ x: [0, -8, 8, -6, 6, 0], transition: { duration: 0.4 } });
        setDigits(Array(PIN_LENGTH).fill(''));
        window.setTimeout(() => focusBox(0), 0);
    } finally {
        setIsVerifying(false);
    }   
  };

  const handleChange = (index: number, raw: string) => {
    // Keep only the last typed digit (handles a stray multi-char paste too).
    const char = raw.replace(/\D/g, '').slice(-1);
    if (!char && raw !== '') return;

    const next = [...digits];
    next[index] = char;
    setDigits(next);
    if (error) setError(false);

    
    if (char && index < PIN_LENGTH - 1) {
        focusBox(index + 1);
    }

    if (!isVerifying && next.every((d) => d !== '')) {
        void submit(next.join(''));
    }

  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      const next = [...digits];
      next[index - 1] = '';
      setDigits(next);
      focusBox(index - 1);
    } else if (e.key === 'ArrowLeft' && index > 0) {
      focusBox(index - 1);
    } else if (e.key === 'ArrowRight' && index < PIN_LENGTH - 1) {
      focusBox(index + 1);
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, PIN_LENGTH);
    if (!pasted) return;
    e.preventDefault();

    const next = Array(PIN_LENGTH).fill('');
    for (let i = 0; i < pasted.length; i += 1) next[i] = pasted[i];
    setDigits(next);
    if (error) setError(false);

    focusBox(Math.min(pasted.length, PIN_LENGTH - 1));
    if (next.every((d) => d !== '')) submit(next.join(''));
  };

  const handleResend = async () => {
    if (cooldown > 0) return;
    try {     
        await onResend();
        setCooldown(RESEND_COOLDOWN);
    } catch (err) {
        console.error('Failed to resend verification code:', err);
    }
  };

  /* Success state — confirmation after a correct PIN. */
  if (verified) {
    return (
      <div className="flex flex-col items-center gap-4 py-6 text-center">
        <span
          style={{ backgroundColor: 'rgba(34,197,94,0.15)' }}
          className="flex h-16 w-16 items-center justify-center rounded-full"
        >
          <CheckCircle2 size={40} className="text-[#22c55e]" />
        </span>
        <h1 className="text-title-md text-on-surface">Email verified!</h1>
        <p className="text-body-md text-metadata">Your email has been successfully confirmed</p>
        <Button variant="brand" size="lg" fullWidth onClick={onContinue}>
          Continue
        </Button>
      </div>
    );
  }

  /* PIN entry state. */
  return (
    <div className="flex flex-col">
      <h1 className="text-title-md text-on-surface">Verify your email</h1>
      <p className="mt-1 text-body-md text-metadata">
        We sent a {PIN_LENGTH}-digit code to <span className="text-on-surface">{email}</span>
      </p>

      <motion.div animate={shake} className="mt-6 flex justify-center gap-2 sm:gap-3">
        {digits.map((digit, i) => (
          <input
            key={i}
            ref={(el) => {
              inputsRef.current[i] = el;
            }}
            type="text"
            inputMode="numeric"
            autoComplete={i === 0 ? 'one-time-code' : 'off'}
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            onPaste={handlePaste}
            aria-label={`Digit ${i + 1}`}
            disabled={isVerifying}
            className={cn(
              'h-14 w-11 rounded-card bg-surface-high text-center text-title-md font-semibold text-on-surface sm:w-12',
              'border transition-colors duration-200 focus:outline-none',
              error
                ? 'border-primary'
                : 'border-transparent focus:border-outline focus:bg-surface-container',
            )}
          />
        ))}
      </motion.div>

      {error ? (
        <p className="mt-3 text-center text-label-sm text-primary">
          Incorrect code, please try again
        </p>
      ) : null}

      <div className="mt-4 text-center text-label-sm text-metadata">
        Didn&apos;t get it?{' '}
        <button
          type="button"
          onClick={handleResend}
          disabled={cooldown > 0 || isVerifying}
          className="font-semibold text-on-surface transition-colors hover:underline disabled:cursor-not-allowed disabled:text-metadata disabled:no-underline disabled:hover:no-underline"
        >
          {cooldown > 0 ? `Resend code in ${cooldown}s` : 'Resend code'}
        </button>
      </div>

      <div className="mt-6 flex flex-col gap-3">
        <Button
          type="button"
          variant="brand"
          size="lg"
          fullWidth
          onClick={() => submit(digits.join(''))}
          disabled={digits.some((d) => d === '') || isVerifying}
        >
           {isVerifying ? 'Verifying...' : 'Verify'}
        </Button>
        {onCancel ? (
          <button
            type="button"
            onClick={onCancel}
            className="text-center text-label-sm font-semibold uppercase tracking-widest text-metadata transition-colors hover:text-on-surface"
          >
            {cancelLabel}
          </button>
        ) : null}
      </div>
    </div>
  );
}