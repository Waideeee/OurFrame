import { useEffect, useRef, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Bell, LogOut, Menu, Search, Settings, User, Users, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { NAV_LINKS } from '@/lib/constants';
import { useScrollPosition } from '@/hooks';
import { useMemories, useProfile } from '@/app/providers';
import { Logo } from './Logo';

const RELATIONSHIP_START_DATE_KEY = 'ourframe:relationshipStartDate';
const ANNIVERSARY_NOTIFICATION_DATE_KEY = 'ourframe:lastAnniversaryNotificationDate';

const getLocalDateKey = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

export function Navbar() {
  const { isScrolled } = useScrollPosition(24);
  const { activeProfile, clearActiveProfile } = useProfile();
  const { getMemory, openMemory } = useMemories();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 'partner-memory',
      text: 'Partner added a new memory',
      timestamp: '2m ago',
      thumbnail: 'https://picsum.photos/seed/ourframe-notification-memory/80/80',
      path: '/recently-added',
      memoryId: 'm-sunset',
      unread: true,
    },
    {
      id: 'memory-hearted',
      text: 'A memory was hearted',
      timestamp: '18m ago',
      thumbnail: 'https://picsum.photos/seed/ourframe-notification-heart/80/80',
      path: '/my-lists',
      memoryId: 'm-first-date',
      unread: true,
    },
    {
      id: 'collection-memory',
      text: 'A memory was added to Our Collection',
      timestamp: '1h ago',
      thumbnail: 'https://picsum.photos/seed/ourframe-notification-collection/80/80',
      path: '/my-lists',
      memoryId: 'm-monthsary-1',
      unread: false,
    },
  ]);
  const notificationRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const unreadNotificationCount = notifications.filter((notification) => notification.unread).length;
  const notificationBadgeText = unreadNotificationCount >= 3 ? '3+' : String(unreadNotificationCount);

  useEffect(() => {
    let relationshipStartDate = '';
    let lastAnniversaryNotificationDate = '';
    try {
      relationshipStartDate = localStorage.getItem(RELATIONSHIP_START_DATE_KEY) ?? '';
      lastAnniversaryNotificationDate = localStorage.getItem(ANNIVERSARY_NOTIFICATION_DATE_KEY) ?? '';
    } catch {
      relationshipStartDate = '';
      lastAnniversaryNotificationDate = '';
    }
    if (!relationshipStartDate) return;

    const startDate = new Date(`${relationshipStartDate}T00:00:00`);
    if (Number.isNaN(startDate.getTime())) return;

    const today = new Date();
    const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    let nextAnniversary = new Date(todayDate.getFullYear(), startDate.getMonth(), startDate.getDate());
    if (nextAnniversary < todayDate) {
      nextAnniversary = new Date(todayDate.getFullYear() + 1, startDate.getMonth(), startDate.getDate());
    }

    const daysUntilAnniversary = Math.round(
      (nextAnniversary.getTime() - todayDate.getTime()) / (1000 * 60 * 60 * 24),
    );
    if (daysUntilAnniversary < 0 || daysUntilAnniversary > 7) return;

    const todayKey = getLocalDateKey(todayDate);
    if (lastAnniversaryNotificationDate === todayKey) return;

    const text =
      daysUntilAnniversary === 0
        ? 'Today is your anniversary!'
        : `${daysUntilAnniversary} ${daysUntilAnniversary === 1 ? 'day' : 'days'} until your anniversary`;

    setNotifications((items) => [
      {
        id: `anniversary-countdown-${todayKey}`,
        text,
        timestamp: 'Today',
        thumbnail: 'https://picsum.photos/seed/ourframe-notification-anniversary/80/80',
        path: '/',
        memoryId: '',
        unread: true,
      },
      ...items,
    ]);

    try {
      localStorage.setItem(ANNIVERSARY_NOTIFICATION_DATE_KEY, todayKey);
    } catch {
      /* storage unavailable — notification remains for this session */
    }
  }, []);

  useEffect(() => {
    if (!notificationOpen) return;
    const onPointerDown = (e: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(e.target as Node)) {
        setNotificationOpen(false);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setNotificationOpen(false);
    };
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [notificationOpen]);

  // Close the profile dropdown on outside click or Escape.
  useEffect(() => {
    if (!profileOpen) return;
    const onPointerDown = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setProfileOpen(false);
    };
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [profileOpen]);

  const goTo = (path: string) => {
    setProfileOpen(false);
    navigate(path);
  };

  const handleSignOut = () => {
    setProfileOpen(false);
    // Clear the active profile (the closest thing to "logout" the app has) and
    // return to the sign-in screen.
    clearActiveProfile();
    navigate('/login');
  };

  const handleNotificationClick = (notification: (typeof notifications)[number]) => {
    const memory = getMemory(notification.memoryId);
    setNotificationOpen(false);
    setNotifications((items) =>
      items.map((item) => (item.id === notification.id ? { ...item, unread: false } : item)),
    );
    navigate(notification.path);
    if (memory) openMemory(memory);
  };

  const profileMenuItems = [
    { label: 'Switch Profile', icon: Users, onClick: () => goTo('/profiles') },
    { label: 'My Profile', icon: User, onClick: () => goTo('/profile') },
    { label: 'Settings', icon: Settings, onClick: () => goTo('/settings') },
  ];

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

          <div ref={notificationRef} className="relative hidden sm:block">
            <button
              type="button"
              aria-label="Notifications"
              aria-haspopup="menu"
              aria-expanded={notificationOpen}
              onClick={() => setNotificationOpen((v) => !v)}
              className="relative rounded-full p-2 text-on-surface transition-colors hover:bg-white/10"
            >
              <Bell size={20} />
              {unreadNotificationCount > 0 ? (
                <span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold leading-none text-white ring-2 ring-canvas">
                  {notificationBadgeText}
                </span>
              ) : null}
            </button>

            <AnimatePresence>
              {notificationOpen ? (
                <motion.div
                  role="menu"
                  initial={{ opacity: 0, y: -8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.98 }}
                  transition={{ duration: 0.18, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="absolute right-0 top-full z-50 mt-3 w-80 origin-top-right rounded-card border border-white/10 bg-[#1e1e1e] py-3 shadow-card-hover"
                >
                  <span className="absolute -top-1.5 right-4 h-3 w-3 rotate-45 border-l border-t border-white/10 bg-[#1e1e1e]" />

                  <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 pb-3">
                    <span className="text-body-md text-on-surface">Notifications</span>
                    <button
                      type="button"
                      onClick={() => setNotifications((items) => items.map((item) => ({ ...item, unread: false })))}
                      className="text-label-sm text-primary transition-colors hover:text-on-surface"
                    >
                      Mark all as read
                    </button>
                  </div>

                  {notifications.length > 0 ? (
                    <div className="pt-1">
                      {notifications.map((notification) => (
                        <button
                          key={notification.id}
                          type="button"
                          role="menuitem"
                          onClick={() => handleNotificationClick(notification)}
                          className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-white/10"
                        >
                          <img
                            src={notification.thumbnail}
                            alt=""
                            className="h-10 w-10 shrink-0 rounded-card object-cover"
                          />
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-body-md text-on-surface">{notification.text}</span>
                            <span className="block text-label-sm text-metadata">{notification.timestamp}</span>
                          </span>
                          {notification.unread ? (
                            <span className="h-2 w-2 shrink-0 rounded-full bg-red-500" aria-label="Unread" />
                          ) : null}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="px-4 py-6 text-center text-body-md text-metadata">You're all caught up</div>
                  )}
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>

          <div ref={profileRef} className="relative hidden sm:block">
            <button
              type="button"
              aria-label="Profile menu"
              aria-haspopup="menu"
              aria-expanded={profileOpen}
              onClick={() => setProfileOpen((v) => !v)}
              className={cn(
                'h-8 w-8 overflow-hidden rounded-avatar border transition-colors',
                profileOpen ? 'border-white/60' : 'border-white/20 hover:border-white/50',
              )}
            >
              {activeProfile ? (
                <img src={activeProfile.avatarUrl} alt={activeProfile.name} className="h-full w-full object-cover" />
              ) : (
                <span className="flex h-full w-full items-center justify-center bg-surface-high text-label-sm">
                  ?
                </span>
              )}
            </button>

            <AnimatePresence>
              {profileOpen ? (
                <motion.div
                  role="menu"
                  initial={{ opacity: 0, y: -8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.98 }}
                  transition={{ duration: 0.18, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="absolute right-0 top-full z-50 mt-3 w-60 origin-top-right rounded-card border border-white/10 bg-[#141414] py-2 shadow-card-hover"
                >
                  {/* Upward caret pointing at the avatar. */}
                  <span className="absolute -top-1.5 right-3 h-3 w-3 rotate-45 border-l border-t border-white/10 bg-[#141414]" />

                  {/* Current-profile header. */}
                  <div className="flex items-center gap-3 border-b border-white/10 px-4 pb-3">
                    <span className="h-9 w-9 shrink-0 overflow-hidden rounded-avatar border border-white/20">
                      {activeProfile ? (
                        <img
                          src={activeProfile.avatarUrl}
                          alt={activeProfile.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="flex h-full w-full items-center justify-center bg-surface-high text-label-sm">
                          ?
                        </span>
                      )}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-body-md text-on-surface">
                        {activeProfile?.name ?? 'No profile'}
                      </span>
                      <span className="block text-label-sm text-metadata">Current profile</span>
                    </span>
                  </div>

                  <div className="pt-1">
                    {profileMenuItems.map((item) => (
                      <button
                        key={item.label}
                        type="button"
                        role="menuitem"
                        onClick={item.onClick}
                        className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-body-md text-metadata transition-colors hover:bg-white/10 hover:text-on-surface"
                      >
                        <item.icon size={18} className="shrink-0" />
                        {item.label}
                      </button>
                    ))}
                  </div>

                  <div className="mt-1 border-t border-white/10 pt-1">
                    <button
                      type="button"
                      role="menuitem"
                      onClick={handleSignOut}
                      className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-body-md text-metadata transition-colors hover:bg-white/10 hover:text-on-surface"
                    >
                      <LogOut size={18} className="shrink-0" />
                      Sign Out
                    </button>
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>

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
