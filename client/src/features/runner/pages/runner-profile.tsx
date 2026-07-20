import { useAuth } from '../../../providers/auth-provider';
import { Mail, Calendar, Building2, Star, ShieldCheck } from 'lucide-react';

export function RunnerProfile() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h3 className="text-xl font-bold text-neutral-900 dark:text-white">Runner Profile</h3>
        <p className="text-sm text-neutral-500">View your runner account details, verification status, and operational territory.</p>
      </div>

      <div className="bg-white dark:bg-[#13141b] rounded-2xl border border-neutral-200/60 dark:border-neutral-800/80 p-6 md:p-8 space-y-6 shadow-xs">
        {/* Profile Header */}
        <div className="flex items-center gap-4 pb-6 border-b border-neutral-100 dark:border-neutral-800">
          <div className="h-16 w-16 bg-indigo-100 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center text-xl font-extrabold capitalize">
            {user.name.charAt(0)}
          </div>
          <div>
            <h2 className="text-xl font-bold text-neutral-900 dark:text-white">{user.name}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200/40 text-indigo-700 dark:text-indigo-400 text-xs font-semibold px-2 py-0.5 rounded capitalize">
                {user.role}
              </span>
              {user.isVerified ? (
                <span className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200/40 text-emerald-700 dark:text-emerald-400 text-xs font-semibold px-2 py-0.5 rounded flex items-center gap-0.5">
                  <ShieldCheck className="h-3 w-3" />
                  KYC Verified
                </span>
              ) : (
                <span className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200/40 text-amber-700 dark:text-amber-400 text-xs font-semibold px-2 py-0.5 rounded">
                  Verification Pending
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Detail Items */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-sm">
            <Mail className="h-4 w-4 text-neutral-400 shrink-0" />
            <div className="flex-1">
              <span className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider">Email</span>
              <span className="font-semibold text-neutral-900 dark:text-white">{user.email}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-sm">
            <Calendar className="h-4 w-4 text-neutral-400 shrink-0" />
            <div className="flex-1">
              <span className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider">Member Since</span>
              <span className="font-semibold text-neutral-900 dark:text-white">
                {new Date(user.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          {user.runnerMetadata && (
            <>
              <div className="flex items-center gap-3 text-sm">
                <Building2 className="h-4 w-4 text-neutral-400 shrink-0" />
                <div className="flex-1">
                  <span className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider">Municipality</span>
                  <span className="font-semibold text-neutral-900 dark:text-white">
                    {user.runnerMetadata.municipalityId || 'Not Set'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 text-sm">
                <Star className="h-4 w-4 text-amber-500 shrink-0" />
                <div className="flex-1">
                  <span className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider">Rating</span>
                  <span className="font-semibold text-neutral-900 dark:text-white">
                    {user.runnerMetadata.rating}/5
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
