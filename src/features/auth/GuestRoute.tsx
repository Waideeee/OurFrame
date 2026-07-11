import { Navigate } from 'react-router-dom';
import { useAuth } from '@/app/providers';

interface GuestRouteProps {
  children: React.ReactNode;
}

export function GuestRoute({
  children,
}: GuestRouteProps) {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}