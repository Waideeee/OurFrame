import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { NAV_LINKS } from '@/lib/constants';
import { useScrollPosition } from '@/hooks';
import { useProfile } from '@/app/providers';
import { Logo } from './Logo';

export function Navbar() {
  const { isScrolled } = useScrollPosition(24);
  const { activeProfile } = useProfile();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      'relative py-1 text-body-md transition-colors duration-200',
      isActive ? 'text-on-surface' : 'text-metadata hover:text-on-surface',
    );

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-colors duration-300 ease-cinematic',
        isScrolled || mobileOpen ? 'bg-canvas/95 backdrop-blur-sm' : 'bg-gradient-to-b from-black/80 to-transparent',
      )}
    >
      <nav className="container-edge flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-8">
          <Logo />
          <ul className="hidden items-center gap-6 lg:flex">
            {NAV_LINKS.map((link) => (
              <li key={link.label}>
                <NavLink to={link.path} end={link.path === '/'} className={linkClass}>
                  {({ isActive }) => (
                    <>
                      {link.label}
                      {isActive ? (
                        <motion.span
                          layoutId="nav-underline"
                          className="absolute -bottom-1 left-0 h-0.5 w-full rounded-full bg-primary"
                        />
                      ) : null}
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="Search"
            onClick={() => navigate('/search')}
            className="rounded-full p-2 text-on-surface transition-colors hover:bg-white/10"
          >
            <Search size={20} />
          </button>

          <Link
            to="/profiles"
            aria-label="Switch profile"
            className="hidden h-8 w-8 overflow-hidden rounded-avatar border border-white/20 sm:block"
          >
            {activeProfile ? (
              <img src={activeProfile.avatarUrl} alt={activeProfile.name} className="h-full w-full object-cover" />
            ) : (
              <span className="flex h-full w-full items-center justify-center bg-surface-high text-label-sm">
                ?
              </span>
            )}
          </Link>

          <button
            type="button"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
            className="rounded-full p-2 text-on-surface transition-colors hover:bg-white/10 lg:hidden"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden border-t border-white/10 lg:hidden"
          >
            <ul className="container-edge flex flex-col gap-1 py-4">
              {NAV_LINKS.map((link) => (
                <li key={link.label}>
                  <NavLink
                    to={link.path}
                    end={link.path === '/'}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      cn(
                        'block rounded-card px-3 py-2.5 text-body-md',
                        isActive ? 'bg-surface text-on-surface' : 'text-metadata hover:bg-surface/60',
                      )
                    }
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
