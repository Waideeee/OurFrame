import type { ReactNode } from 'react';
import { Logo } from './Logo';
import { img } from '@/data';

interface AuthLayoutProps {
  children: ReactNode;
  /** Footer link cluster shown beneath the card (login/signup share this). */
  footer?: ReactNode;
}

/** Dimmed hero background with a centered dark card — auth screens. */
export function AuthLayout({ children, footer }: AuthLayoutProps) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <img
        src={img('auth-hero', 1920, 1080)}
        alt=""
        aria-hidden
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-black/70" />

      <header className="container-edge relative z-10 py-6">
        <Logo />
      </header>

      <main className="relative z-10 flex flex-1 items-center justify-center px-4 py-8">
        <div className="w-full max-w-md rounded-card bg-black/75 p-8 backdrop-blur-sm sm:p-12">
          {children}
        </div>
      </main>

      {footer ? (
        <footer className="relative z-10 border-t border-white/10 bg-black/60 py-8">
          <div className="container-edge text-metadata">{footer}</div>
        </footer>
      ) : null}
    </div>
  );
}
