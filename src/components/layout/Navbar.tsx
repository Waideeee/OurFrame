import { useEffect, useRef, useState,useMemo } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Bell, LogOut, Menu, Search, Settings, User, Users, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { NAV_LINKS } from '@/lib/constants';
import { useScrollPosition } from '@/hooks';
import { useProfile } from '@/app/providers';
import { Logo } from './Logo';
import { fetchNotifications, markNotificationRead, markAllNotificationsRead, type Notification } from '@/lib/notifications';
import { getSocket } from '@/lib/socket';
import relativeTime from "dayjs/plugin/relativeTime";
import dayjs from "dayjs";
import { useAuth } from '@/app/providers';
dayjs.extend(relativeTime);
export function Navbar() {
  const { isScrolled } = useScrollPosition(24);
  const { activeProfile, clearActiveProfile } = useProfile();
  
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const notificationRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
 const unreadNotificationCount = useMemo(
    () => notifications.filter(n => !n.isRead).length,
    [notifications]
);
  const notificationBadgeText = unreadNotificationCount >= 99 ? '99+' : String(unreadNotificationCount);

  const {logout} = useAuth();

  useEffect(() => {
  if (!activeProfile) return;
  fetchNotifications(activeProfile.profileId)
    .then(setNotifications)
    .catch(console.error);
}, [activeProfile]);

useEffect(() => {
    const socket = getSocket();

    if (!socket || !activeProfile) return;

    socket.emit('joinProfile', activeProfile.profileId);

    return () => {
        socket.emit('leaveProfile', activeProfile.profileId);
    };
}, [activeProfile]);

useEffect(() => {
    const socket = getSocket();

    if (!socket) return;

    const handleNewNotification = (notification: Notification) => {

    setNotifications(prev => {
        if (prev.some(n => n.id === notification.id)) {
            return prev;
        }

        return [notification, ...prev];
    });
};

    socket.on('newNotification', handleNewNotification);

    return () => {
        socket.off('newNotification', handleNewNotification);
    };
}, []);

const handleMarkAllRead = async () => {
    if (!activeProfile) return;

    try {
        await markAllNotificationsRead(activeProfile.profileId);

        setNotifications(prev =>
            prev.map(n => ({
                ...n,
                isRead: true
            }))
        );
    } catch (err) {
        console.error(err);
    }
}


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

    logout();
    navigate('/login', {
    replace: true,
  });
  };

const handleNotificationClick = async (notification: Notification) => {
  if (!notification.isRead) {
    try {
      await markNotificationRead(notification.id);

      setNotifications(prev =>
        prev.map(n =>
          n.id === notification.id
            ? { ...n, isRead: true }
            : n
        )
      );
    } catch (err) {
      console.error(err);
    }
  }

  setNotificationOpen(false);

  switch (notification.type) {
    case 'partner_added_memory':
    case 'memory_hearted':
      if (notification.memoryId) {
        navigate(`/memory/${notification.memoryId}`);
      }
      break;

    case 'memory_added_to_collection':
      navigate('/my-list');
      break;

    case 'monthly_recap':
      navigate('/recap');
      break;

    case 'milestone_reminder':
      navigate('/');
      break;

    default:
      break;
  }
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

    
    
const formatNotificationDate = (date: string) => dayjs(date).fromNow();

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
                    {unreadNotificationCount > 0 && (
                      <button
                           type="button"
                           onClick={handleMarkAllRead}
                           className="text-label-sm text-primary transition-colors hover:text-on-surface"
                      >
                          Mark all as read
                      </button>
                  )}
                  </div>

                  {notifications.length > 0 ? (
                    <div className="max-h-96 overflow-y-auto pt-1">
                      {notifications.map((notification) => (
                        <button
                          key={notification.id}
                          type="button"
                          role="menuitem"
                          onClick={() => handleNotificationClick(notification)}
                          className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-white/10"
                        >
                          <img
                            src={notification.imageUrl ?? "Pictures\default-image-notif.png"}
                            alt=""
                            className="h-10 w-10 shrink-0 rounded-card object-cover"
                          />
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-body-md text-on-surface">{notification.message}</span>
                            <span className="block text-label-sm text-metadata">{formatNotificationDate(notification.createdAt)}</span>
                          </span>
                          {!notification.isRead ? (
                            <span className="h-2 w-2 shrink-0 rounded-full bg-red-500" aria-label="Unread" />
                          ) : null}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="px-4 py-6 text-center text-body-md text-metadata"> 
                    <Bell className="text-metadata" size={28} />

                    <p className="text-body-md text-on-surface">
                      You're all caught up
                    </p>

                    <p className="text-label-sm text-metadata">
                      New notifications will appear here.
                    </p>
                    </div>
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
