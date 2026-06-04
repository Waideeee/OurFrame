import type { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

/**
 * Shell for all content routes: sticky navbar + page outlet + footer.
 * Hero-led pages render edge-to-edge, so no top padding is forced here.
 */
export function PageContainer({ children }: { children?: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex-1">{children ?? <Outlet />}</main>
      <Footer />
    </div>
  );
}
