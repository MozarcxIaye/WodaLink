import { Navigate, useLocation, Outlet } from 'react-router';
import { useAuth } from '../providers/auth-provider';
import type { UserRole } from '../types';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  allowedRoles?: UserRole[];
}

export function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-50 dark:bg-[#0b0c10]">
        <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
        <span className="text-sm font-medium text-neutral-500 mt-2">Checking session...</span>
      </div>
    );
  }

  // If not logged in, redirect to login page
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If logged in but role is not allowed for this route, redirect to their home dashboard
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={`/${user.role}/dashboard`} replace />;
  }

  return <Outlet />;
}
