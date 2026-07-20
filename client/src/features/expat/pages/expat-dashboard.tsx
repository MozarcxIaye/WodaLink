import { useProcurementDashboard } from '../../procurement/hooks/use-procurement';
import type { ExpatDashboardData } from '../../../types';
import { Link } from 'react-router';
import { StatusBadge } from '../../../components/status-badge';
import { Loader2, Plus, ArrowRight, FileText, CheckCircle2, History, AlertCircle } from 'lucide-react';

export function ExpatDashboard() {
  const { data, isLoading, error } = useProcurementDashboard();

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

  const dashboardData = data as ExpatDashboardData;
  const { openRequests = [], history = [], summary } = dashboardData;

  return (
    <div className="space-y-8">
      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-[#13141b] p-6 rounded-2xl border border-neutral-200/60 dark:border-neutral-800/80 shadow-xs flex flex-col justify-between">
          <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Pending Approval</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-extrabold text-neutral-900 dark:text-white">
              {summary?.pendingApprovalCount || 0}
            </span>
          </div>
          <span className="text-xxs text-neutral-500 mt-2">Awaiting runner to claim</span>
        </div>

        <div className="bg-white dark:bg-[#13141b] p-6 rounded-2xl border border-neutral-200/60 dark:border-neutral-800/80 shadow-xs flex flex-col justify-between">
          <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Active Procurement</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-extrabold text-neutral-900 dark:text-white">
              {summary?.activeProcessingCount || 0}
            </span>
          </div>
          <span className="text-xxs text-neutral-500 mt-2">Currently being obtained in Nepal</span>
        </div>

        <div className="bg-white dark:bg-[#13141b] p-6 rounded-2xl border border-neutral-200/60 dark:border-neutral-800/80 shadow-xs flex flex-col justify-between">
          <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Quick Actions</span>
          <div className="mt-4 flex flex-col gap-2">
            <Link
              to="/expat/requests/new"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 py-2 px-4 text-xs font-semibold text-white hover:bg-blue-700 transition-colors shadow-sm"
            >
              <Plus className="h-3.5 w-3.5" />
              New Procurement
            </Link>
            <Link
              to="/expat/requests"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 py-2 px-4 text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200/60 dark:hover:bg-neutral-700/60 transition-colors"
            >
              View Requests
            </Link>
          </div>
        </div>
      </div>

      {/* Active Pipeline */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-neutral-950 dark:text-white">Active Pipeline</h3>
        {openRequests.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-neutral-200/60 dark:border-neutral-800/60 p-8 text-center bg-white dark:bg-[#13141b]">
            <FileText className="h-10 w-10 text-neutral-300 dark:text-neutral-700 mx-auto" />
            <p className="mt-2 text-sm text-neutral-500">No active procurement requests.</p>
            <Link
              to="/expat/requests/new"
              className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline"
            >
              Submit your first request <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {openRequests.map((req) => (
              <div
                key={req._id}
                className="bg-white dark:bg-[#13141b] rounded-2xl border border-neutral-200/60 dark:border-neutral-800/80 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-neutral-900 dark:text-white capitalize">
                      {req.documentType.toLowerCase().replace('_', ' ')}
                    </span>
                    <StatusBadge status={req.status} />
                    {req.isPaid ? (
                      <span className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200/40 text-emerald-700 dark:text-emerald-400 text-xxs font-medium px-2 py-0.5 rounded">
                        Paid
                      </span>
                    ) : (
                      <span className="bg-rose-50 dark:bg-rose-500/10 border border-rose-200/40 text-rose-700 dark:text-rose-400 text-xxs font-medium px-2 py-0.5 rounded">
                        Unpaid
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-neutral-500">
                    Ward Code: <span className="font-semibold text-neutral-700 dark:text-neutral-300">{req.wardCode}</span> • Escrow: <span className="font-semibold text-neutral-700 dark:text-neutral-300">${req.escrowAmount}</span>
                  </p>
                </div>
                <Link
                  to={`/expat/requests/${req._id}`}
                  className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 py-2 px-4 text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors w-fit"
                >
                  Track Progress
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* History */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-neutral-950 dark:text-white flex items-center gap-2">
          <History className="h-5 w-5 text-neutral-400" />
          Request History
        </h3>
        {history.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-neutral-200/60 dark:border-neutral-800/60 p-8 text-center bg-white dark:bg-[#13141b]">
            <CheckCircle2 className="h-10 w-10 text-neutral-300 dark:text-neutral-700 mx-auto" />
            <p className="mt-2 text-sm text-neutral-500">No procurement requests in your history.</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-[#13141b]">
            <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {history.map((req) => (
                <div
                  key={req._id}
                  className="p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:bg-neutral-50 dark:hover:bg-neutral-800/30 transition-colors cursor-pointer"
                >
                  <div className="space-y-1">
                    <span className="font-bold text-neutral-900 dark:text-white capitalize">
                      {req.documentType.toLowerCase().replace('_', ' ')}
                    </span>
                    <p className="text-xs text-neutral-500">
                      Ward: {req.wardCode} • Completed Date: {new Date(req.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={req.status} />
                    <span className="text-xs font-semibold text-neutral-600 dark:text-neutral-400">
                      ${req.escrowAmount}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
