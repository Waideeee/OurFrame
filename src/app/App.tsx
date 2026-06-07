import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { ProfileProvider, MemoryProvider } from './providers';

/** Scrolls back to the top whenever the route changes. */
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
}

export function App() {
  return (
    <ProfileProvider>
      <MemoryProvider>
        <ScrollToTop />
        <Outlet />
      </MemoryProvider>
    </ProfileProvider>
  );
}
