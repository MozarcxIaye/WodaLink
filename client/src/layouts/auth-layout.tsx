import { Navigate, Outlet } from 'react-router';
import { useAuth } from '../providers/auth-provider';
import { Layers } from 'lucide-react';

export function AuthLayout() {
  const { user } = useAuth();

  // If user is already authenticated, redirect them to the appropriate portal immediately
  if (user) {
    return <Navigate to={`/${user.role}/dashboard`} replace />;
  }

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-neutral-50 dark:bg-[#0b0c10] text-neutral-900 dark:text-neutral-100 transition-colors duration-200">
      {/* Left panel: Auth Form */}
      <div className="flex flex-col justify-center px-6 py-12 lg:px-16 xl:px-24">
        <div className="mx-auto w-full max-w-md">
          {/* Logo */}
          <div className="flex items-center gap-2 mb-8">
            <Layers className="h-6 w-6 text-blue-600 dark:text-blue-500" />
            <span className="text-xl font-bold tracking-tight">WodaLink</span>
          </div>
          {/* Form Content */}
          <div className="bg-white dark:bg-[#13141b] p-8 rounded-2xl border border-neutral-200/60 dark:border-neutral-800/80 shadow-sm">
            <Outlet />
          </div>
        </div>
      </div>

      {/* Right panel: Visual Banner (only on large screens) */}
      <div className="hidden lg:flex flex-col justify-between p-12 bg-blue-600 dark:bg-blue-950 text-white relative overflow-hidden">
        {/* Decorative Grid Pattern */}
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        
        <div className="relative z-10 flex items-center gap-2">
          <Layers className="h-6 w-6" />
          <span className="font-bold text-lg">WodaLink Procurement</span>
        </div>

        <div className="relative z-10 space-y-6 max-w-lg">
          <h2 className="text-4xl font-extrabold leading-tight">
            Bridging Nepalis Abroad with Trusted Local Procurement.
          </h2>
          <p className="text-blue-100/90 text-md leading-relaxed">
            Need official documents from your ward or municipality? Request birth certificates, marriage clearance, or police records and let verified runners physically procure them for you in Nepal.
          </p>
        </div>

        <div className="relative z-10 border-t border-blue-500/40 dark:border-blue-800/60 pt-6">
          <span className="text-xs font-semibold uppercase tracking-wider text-blue-200">WodaLink Expat & Runner Network</span>
          <p className="text-xs text-blue-200/70 mt-1">© 2026 WodaLink. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
