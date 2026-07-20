import { useProcurementDashboard } from '../../procurement/hooks/use-procurement';
import { useAuth } from '../../../providers/auth-provider';
import { useUpdateAvailability } from '../../marketplace/hooks/use-marketplace';
import type { RunnerDashboardData } from '../../../types';
import { Link } from 'react-router';
import { StatusBadge } from '../../../components/status-badge';
import { toast } from 'sonner';
import { useState } from 'react';
import {
  Loader2,
  ArrowRight,
  Briefcase,
  CheckCircle2,
  Zap,
  AlertCircle,
  Building2,
  ToggleRight,
} from 'lucide-react';

const NEPAL_MUNICIPALITIES = [
  { id: 'KTM', name: 'Kathmandu Metropolitan City' },
  { id: 'LAL', name: 'Lalitpur Metropolitan City' },
  { id: 'PKH', name: 'Pokhara Metropolitan City' },
  { id: 'BHT', name: 'Bharatpur Metropolitan City' },
  { id: 'BRT', name: 'Biratnagar Metropolitan City' },
  { id: 'BGN', name: 'Bhaktapur Municipality' },
  { id: 'KIR', name: 'Kirtipur Municipality' },
];

export function RunnerDashboard() {
  const { user } = useAuth();
  const { data, isLoading, error } = useProcurementDashboard();
  const availabilityMutation = useUpdateAvailability();
  const [selectedMuni, setSelectedMuni] = useState(user?.runnerMetadata?.municipalityId || '');

  const handleUpdateAvailability = async () => {
    if (!selectedMuni) {
      toast.error('Please select a municipality first.');
      return;
    }
    try {
      await availabilityMutation.mutateAsync(selectedMuni);
      toast.success('Availability updated successfully!');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || 'Failed to update availability.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-900/30 dark:bg-red-500/10 text-red-700 dark:text-red-400">
        <div className="flex gap-3">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <div>
            <h4 className="font-bold">Error loading dashboard</h4>
            <p className="text-sm mt-1">Please try reloading the page or logging in again.</p>
          </div>
        </div>
      </div>
    );
  }

  const dashboardData = data as RunnerDashboardData;
  const { activeJobs = [], completedHistory = [], summary } = dashboardData;

  return (
    <div className="space-y-8">
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-[#13141b] p-6 rounded-2xl border border-neutral-200/60 dark:border-neutral-800/80 shadow-xs">
          <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Active Jobs</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-extrabold text-neutral-900 dark:text-white">
              {summary?.activeCount || 0}
            </span>
            <Zap className="h-5 w-5 text-amber-500" />
          </div>
          <span className="text-xs text-neutral-500 mt-2 block">Currently assigned or in progress</span>
        </div>

        <div className="bg-white dark:bg-[#13141b] p-6 rounded-2xl border border-neutral-200/60 dark:border-neutral-800/80 shadow-xs">
          <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Completed</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-extrabold text-neutral-900 dark:text-white">
              {summary?.completedTotal || 0}
            </span>
            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
          </div>
          <span className="text-xs text-neutral-500 mt-2 block">Successfully fulfilled procurement jobs</span>
        </div>

        <div className="bg-white dark:bg-[#13141b] p-6 rounded-2xl border border-neutral-200/60 dark:border-neutral-800/80 shadow-xs">
          <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Quick Actions</span>
          <div className="mt-4 flex flex-col gap-2">
            <Link
              to="/runner/jobs"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 py-2 px-4 text-xs font-semibold text-white hover:bg-blue-700 transition-colors shadow-sm"
            >
              <Briefcase className="h-3.5 w-3.5" />
              Browse Open Jobs
            </Link>
          </div>
        </div>
      </div>

      {/* Availability Toggle */}
      <div className="bg-white dark:bg-[#13141b] rounded-2xl border border-neutral-200/60 dark:border-neutral-800/80 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-2">
              <Building2 className="h-4 w-4 text-neutral-400  " />
              Municipality Availability
            </h3>
            <p className="text-xs text-neutral-500 mt-1">Set the area where you can procure official documents from ward offices.</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-end gap-3">
          <div className="flex-1 w-full">
            <select
              value={selectedMuni}
              onChange={(e) => setSelectedMuni(e.target.value)}
              className="w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 py-2.5 pl-3 pr-4 text-sm outline-none transition-colors appearance-none text-neutral-900 dark:text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
              <option value="">Select your municipality</option>
              {NEPAL_MUNICIPALITIES.map((muni) => (
                <option key={muni.id} value={muni.id}>
                  {muni.name}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={handleUpdateAvailability}
            disabled={availabilityMutation.isPending}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 py-2.5 px-5 text-xs font-semibold text-white transition-all disabled:opacity-50 shadow-sm whitespace-nowrap"
          >
            {availabilityMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ToggleRight className="h-4 w-4" />
            )}
            Update Territory
          </button>
        </div>

        {user?.runnerMetadata?.municipalityId && (
          <div className="text-xs text-neutral-500">
            Current territory: <span className="font-semibold text-neutral-700 dark:text-neutral-300">{user.runnerMetadata.municipalityId}</span>
            {' '} • Rating: <span className="font-semibold text-amber-600">{user.runnerMetadata.rating}/5</span>
          </div>
        )}
      </div>

      {/* Active Jobs Pipeline */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-neutral-950 dark:text-white">Active Jobs Pipeline</h3>
        {activeJobs.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-neutral-200/60 dark:border-neutral-800/60 p-8 text-center bg-white dark:bg-[#13141b]">
            <Briefcase className="h-10 w-10 text-neutral-300 dark:text-neutral-700 mx-auto" />
            <p className="mt-2 text-sm text-neutral-500">No active jobs. Browse the marketplace for open requests.</p>
            <Link
              to="/runner/jobs"
              className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline"
            >
              Browse Open Jobs <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {activeJobs.map((job) => (
              <div
                key={job._id}
                className="bg-white dark:bg-[#13141b] rounded-2xl border border-neutral-200/60 dark:border-neutral-800/80 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-neutral-900 dark:text-white capitalize">
                      {job.documentType.toLowerCase().replace('_', ' ')}
                    </span>
                    <StatusBadge status={job.status} />
                  </div>
                  <p className="text-xs text-neutral-500">
                    Ward: <span className="font-semibold text-neutral-700 dark:text-neutral-300">{job.wardCode}</span>
                    {' '} • Escrow: <span className="font-semibold text-neutral-700 dark:text-neutral-300">${job.escrowAmount}</span>
                  </p>
                </div>
                <Link
                  to={`/runner/jobs/${job._id}`}
                  className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 py-2 px-4 text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors w-fit"
                >
                  Manage Job <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Completed History */}
      {completedHistory.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-neutral-950 dark:text-white">Completed History</h3>
          <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-[#13141b]">
            <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {completedHistory.map((job) => (
                <div key={job._id} className="p-4 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="font-bold text-neutral-900 dark:text-white capitalize text-sm">
                      {job.documentType.toLowerCase().replace('_', ' ')}
                    </span>
                    <p className="text-xs text-neutral-500">
                      Completed {new Date(job.updatedAt).toLocaleDateString()} • Ward: {job.wardCode}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={job.status} />
                    <span className="text-xs font-semibold text-neutral-600 dark:text-neutral-400">${job.escrowAmount}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
