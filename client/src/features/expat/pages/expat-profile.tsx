import { useAuth } from '../../../providers/auth-provider';
import { ShieldCheck, Mail, Calendar, UserCheck } from 'lucide-react';

export function ExpatProfile() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h3 className="text-xl font-bold text-neutral-900 dark:text-white">My Profile</h3>
        <p className="text-sm text-neutral-500">Manage your WodaLink Expat account settings and verification details.</p>
      </div>

      <div className="bg-white dark:bg-[#13141b] rounded-2xl border border-neutral-200/60 dark:border-neutral-800/80 p-6 md:p-8 space-y-6 shadow-xs">
        {/* User Card Header */}
        <div className="flex items-center gap-4 pb-6 border-b border-neutral-100 dark:border-neutral-800">
          <div className="h-16 w-16 bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-xl font-extrabold capitalize">
            {user.name.charAt(0)}
          </div>
          <div>
            <h2 className="text-xl font-bold text-neutral-900 dark:text-white">{user.name}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="bg-blue-50 dark:bg-blue-500/10 border border-blue-200/40 text-blue-700 dark:text-blue-400 text-xxs font-semibold px-2 py-0.5 rounded capitalize">
                {user.role}
              </span>
              {user.isVerified ? (
                <span className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200/40 text-emerald-700 dark:text-emerald-400 text-xxs font-semibold px-2 py-0.5 rounded flex items-center gap-0.5">
                  <ShieldCheck className="h-3 w-3" />
                  KYC Verified
                </span>
              ) : (
                <span className="bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 text-xxs font-semibold px-2 py-0.5 rounded">
                  Unverified
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Profile Info Details */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-sm">
            <Mail className="h-4 w-4 text-neutral-400 shrink-0" />
            <div className="flex-1">
              <span className="block text-xxs font-semibold text-neutral-400 uppercase tracking-wider">Email Address</span>
              <span className="font-semibold text-neutral-900 dark:text-white">{user.email}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-sm">
            <Calendar className="h-4 w-4 text-neutral-400 shrink-0" />
            <div className="flex-1">
              <span className="block text-xxs font-semibold text-neutral-400 uppercase tracking-wider">Member Since</span>
              <span className="font-semibold text-neutral-900 dark:text-white">
                {new Date(user.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-sm">
            <UserCheck className="h-4 w-4 text-neutral-400 shrink-0" />
            <div className="flex-1">
              <span className="block text-xxs font-semibold text-neutral-400 uppercase tracking-wider">Account Status</span>
              <span className="font-semibold text-neutral-900 dark:text-white">Active</span>
            </div>
          </div>
        </div>

        {/* Read-Only Notice */}
        <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200/40 dark:border-neutral-700/40 text-center">
          <p className="text-xs text-neutral-500">
            For security reasons and compliance rules regarding cross-border identity verification, profile modification is handled by support agents. Please contact WodaLink support to update your details.
          </p>
        </div>
      </div>
    </div>
  );
}
