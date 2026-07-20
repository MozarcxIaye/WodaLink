import { Link } from 'react-router';
import { useEscalations, useResolveEscalation } from '../../procurement/hooks/use-procurement';
import { useRequests } from '../../procurement/hooks/use-procurement';
import type { DocumentRequest } from '../../../types';
import { StatusBadge } from '../../../components/status-badge';
import {
  Loader2,
  AlertCircle,
  FileSearch,
  Users,
  Activity,
  ShieldCheck,
  DollarSign,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';

const STATUS_CONFIG: Array<{ key: DocumentRequest['status']; label: string; description: string }> = [
  { key: 'PENDING', label: 'Pending', description: 'Awaiting payment or runner claim' },
  { key: 'ASSIGNED', label: 'Assigned', description: 'Runner claimed the task' },
  { key: 'IN_PROGRESS', label: 'In Progress', description: 'Procurement is underway' },
  { key: 'COMPLETED', label: 'Completed', description: 'Work has been delivered' },
  { key: 'CANCELLED', label: 'Cancelled', description: 'Request was cancelled' },
];

const DOCUMENT_LABELS: Record<string, string> = {
  BIRTH_CERTIFICATE: 'Birth Certificate',
  MARRIAGE_CERTIFICATE: 'Marriage Certificate',
  POLICE_CLEARANCE: 'Police Clearance',
  OTHER: 'Other',
};

export function AdminDashboard() {
  const { data: requests = [], isLoading, error } = useRequests();
  const { data: escalations = [], isLoading: isEscalationsLoading } = useEscalations();
  const resolveEscalationMutation = useResolveEscalation();

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-900/30 dark:bg-red-500/10 dark:text-red-400">
        <div className="flex gap-3">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <div>
            <h4 className="font-bold">Error loading admin dashboard</h4>
            <p className="text-sm mt-1">Unable to retrieve platform data. Please check your permissions.</p>
          </div>
        </div>
      </div>
    );
  }

  const statusCounts = requests.reduce<Record<string, number>>((acc, req) => {
    acc[req.status] = (acc[req.status] || 0) + 1;
    return acc;
  }, {});

  const totalEscrow = requests.reduce((sum, req) => sum + (req.escrowAmount || 0), 0);
  const paidRequests = requests.filter((r) => r.isPaid).length;
  const unassignedPending = requests.filter((r) => r.status === 'PENDING' && !r.runnerId).length;
  const needsAttention = [...requests]
    .filter((req) => req.status === 'PENDING' || req.status === 'ASSIGNED')
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  const documentTypeCounts = requests.reduce<Record<string, number>>((acc, req) => {
    const key = req.documentType;
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const recentActivity = [...requests]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 6);

  const totalActive = (statusCounts['PENDING'] || 0) + (statusCounts['ASSIGNED'] || 0) + (statusCounts['IN_PROGRESS'] || 0);
  const completionRate = requests.length ? Math.round(((statusCounts['COMPLETED'] || 0) / requests.length) * 100) : 0;
  const escalationCount = escalations.length;
  const staleEscalations = escalations.filter((item) => item.escalationLevel === 'high').length;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-neutral-200/60 bg-white p-5 shadow-xs dark:border-neutral-800/80 dark:bg-[#13141b]">
          <div className="mb-2 flex items-center gap-2">
            <FileSearch className="h-4 w-4 text-blue-500" />
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Total Requests</span>
          </div>
          <span className="text-2xl font-extrabold text-neutral-900 dark:text-white">{requests.length}</span>
          <p className="mt-2 text-xs text-neutral-500">All requests submitted through the platform.</p>
        </div>

        <div className="rounded-2xl border border-neutral-200/60 bg-white p-5 shadow-xs dark:border-neutral-800/80 dark:bg-[#13141b]">
          <div className="mb-2 flex items-center gap-2">
            <Activity className="h-4 w-4 text-emerald-500" />
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Completed</span>
          </div>
          <span className="text-2xl font-extrabold text-neutral-900 dark:text-white">{statusCounts['COMPLETED'] || 0}</span>
          <p className="mt-2 text-xs text-neutral-500">{completionRate}% of all requests are finished.</p>
        </div>

        <div className="rounded-2xl border border-neutral-200/60 bg-white p-5 shadow-xs dark:border-neutral-800/80 dark:bg-[#13141b]">
          <div className="mb-2 flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-amber-500" />
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Escrow Value</span>
          </div>
          <span className="text-2xl font-extrabold text-neutral-900 dark:text-white">${totalEscrow.toLocaleString()}</span>
          <p className="mt-2 text-xs text-neutral-500">Total funds currently tied to requests.</p>
        </div>

        <div className="rounded-2xl border border-neutral-200/60 bg-white p-5 shadow-xs dark:border-neutral-800/80 dark:bg-[#13141b]">
          <div className="mb-2 flex items-center gap-2">
            <Users className="h-4 w-4 text-indigo-500" />
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Paid Requests</span>
          </div>
          <span className="text-2xl font-extrabold text-neutral-900 dark:text-white">{paidRequests}</span>
          <p className="mt-2 text-xs text-neutral-500">Requests with escrow already paid.</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-2xl border border-neutral-200/60 bg-white p-6 shadow-xs dark:border-neutral-800/80 dark:bg-[#13141b]">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-neutral-950 dark:text-white">Workflow Breakdown</h3>
              <p className="text-sm text-neutral-500">A quick view of how requests are moving through the pipeline.</p>
            </div>
            <div className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
              {totalActive} active
            </div>
          </div>

          <div className="space-y-4">
            {STATUS_CONFIG.map((item) => {
              const count = statusCounts[item.key] || 0;
              const percent = requests.length ? Math.round((count / requests.length) * 100) : 0;
              return (
                <div key={item.key}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="font-medium text-neutral-700 dark:text-neutral-300">{item.label}</span>
                    <span className="text-neutral-500">{count} ({percent}%)</span>
                  </div>
                  <div className="h-2 rounded-full bg-neutral-100 dark:bg-neutral-800">
                    <div className="h-2 rounded-full bg-blue-600" style={{ width: `${percent}%` }} />
                  </div>
                  <p className="mt-1 text-xs text-neutral-500">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-2xl border border-neutral-200/60 bg-white p-6 shadow-xs dark:border-neutral-800/80 dark:bg-[#13141b]">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-neutral-950 dark:text-white">Needs Attention</h3>
              <p className="text-sm text-neutral-500">Requests that are waiting on action from the ops team.</p>
            </div>
            <div className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-600 dark:bg-amber-500/10 dark:text-amber-400">
              {unassignedPending} unassigned
            </div>
          </div>

          {needsAttention.length === 0 ? (
            <div className="rounded-xl border border-dashed border-neutral-200 p-4 text-sm text-neutral-500 dark:border-neutral-800">
              No requests currently need follow-up.
            </div>
          ) : (
            <div className="space-y-3">
              {needsAttention.map((req) => (
                <div key={req._id} className="rounded-xl border border-neutral-200/70 bg-neutral-50/70 p-3 dark:border-neutral-800 dark:bg-neutral-900/60">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-neutral-900 dark:text-white">
                      {DOCUMENT_LABELS[req.documentType] || req.documentType}
                    </span>
                    <StatusBadge status={req.status} />
                  </div>
                  <p className="mt-2 text-xs text-neutral-500">
                    Ward {req.wardCode} • {req.isPaid ? 'Paid' : 'Awaiting payment'} • {req.runnerId ? 'Runner assigned' : 'No runner yet'}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-2xl border border-amber-200/70 bg-white p-6 shadow-xs dark:border-amber-900/40 dark:bg-[#13141b]">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-neutral-950 dark:text-white">Escalations</h3>
              <p className="text-sm text-neutral-500">Requests flagged for admin attention.</p>
            </div>
            <div className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-600 dark:bg-amber-500/10 dark:text-amber-400">
              {escalationCount} active
            </div>
          </div>

          {isEscalationsLoading ? (
            <div className="flex items-center justify-center py-6 text-sm text-neutral-500">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading escalations...
            </div>
          ) : escalations.length === 0 ? (
            <div className="rounded-xl border border-dashed border-neutral-200 p-4 text-sm text-neutral-500 dark:border-neutral-800">
              No escalations right now.
            </div>
          ) : (
            <div className="space-y-3">
              {escalations.map((req) => (
                <div key={req._id} className="rounded-xl border border-neutral-200/70 bg-neutral-50/70 p-3 dark:border-neutral-800 dark:bg-neutral-900/60">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-neutral-900 dark:text-white">
                          {DOCUMENT_LABELS[req.documentType] || req.documentType}
                        </span>
                        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-amber-700 dark:bg-amber-500/10 dark:text-amber-300">
                          {req.escalationLevel || 'medium'}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-neutral-500">
                        {req.escalationReason || 'Manual escalation'} • Ward {req.wardCode}
                      </p>
                      {req.adminNote ? <p className="mt-1 text-xs text-neutral-500">Note: {req.adminNote}</p> : null}
                    </div>
                    <button
                      type="button"
                      onClick={() => resolveEscalationMutation.mutate({ id: req._id })}
                      className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 hover:bg-emerald-100 dark:border-emerald-900/40 dark:bg-emerald-500/10 dark:text-emerald-300"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" /> Resolve
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-neutral-200/60 bg-white p-6 shadow-xs dark:border-neutral-800/80 dark:bg-[#13141b]">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-neutral-950 dark:text-white">Ops Health</h3>
              <p className="text-sm text-neutral-500">Quick indicators for admin follow-up.</p>
            </div>
            <div className="rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-600 dark:bg-red-500/10 dark:text-red-400">
              {staleEscalations} critical
            </div>
          </div>

          <div className="space-y-3">
            <div className="rounded-xl border border-neutral-200/70 bg-neutral-50/70 p-3 dark:border-neutral-800 dark:bg-neutral-900/60">
              <div className="flex items-center gap-2 text-sm font-semibold text-neutral-900 dark:text-white">
                <AlertTriangle className="h-4 w-4 text-amber-500" /> Unassigned pending requests
              </div>
              <p className="mt-1 text-xs text-neutral-500">{unassignedPending} requests need a runner fast.</p>
            </div>
            <div className="rounded-xl border border-neutral-200/70 bg-neutral-50/70 p-3 dark:border-neutral-800 dark:bg-neutral-900/60">
              <div className="flex items-center gap-2 text-sm font-semibold text-neutral-900 dark:text-white">
                <DollarSign className="h-4 w-4 text-amber-500" /> Awaiting payment
              </div>
              <p className="mt-1 text-xs text-neutral-500">{requests.filter((req) => req.status === 'COMPLETED' && !req.isPaid).length} completed requests still need payout release.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-2xl border border-neutral-200/60 bg-white p-6 shadow-xs dark:border-neutral-800/80 dark:bg-[#13141b]">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-neutral-950 dark:text-white">Recent Activity</h3>
              <p className="text-sm text-neutral-500">The most recently updated requests.</p>
            </div>
            <Link to="/admin/requests" className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:underline dark:text-blue-400">
              View all requests <Sparkles className="h-4 w-4" />
            </Link>
          </div>

          {recentActivity.length === 0 ? (
            <div className="rounded-xl border border-dashed border-neutral-200 p-4 text-sm text-neutral-500 dark:border-neutral-800">
              No activity to display yet.
            </div>
          ) : (
            <div className="space-y-3">
              {recentActivity.map((req) => (
                <div key={req._id} className="flex flex-col gap-2 rounded-xl border border-neutral-200/70 bg-neutral-50/70 p-3 dark:border-neutral-800 dark:bg-neutral-900/60 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-neutral-900 dark:text-white">
                        {DOCUMENT_LABELS[req.documentType] || req.documentType}
                      </span>
                      <span className="text-xs text-neutral-500">{req.wardCode}</span>
                    </div>
                    <p className="mt-1 text-xs text-neutral-500">
                      Updated {new Date(req.updatedAt).toLocaleDateString()} • Escrow ${req.escrowAmount}
                    </p>
                  </div>
                  <StatusBadge status={req.status} />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-neutral-200/60 bg-white p-6 shadow-xs dark:border-neutral-800/80 dark:bg-[#13141b]">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-neutral-950 dark:text-white">Document Demand</h3>
              <p className="text-sm text-neutral-500">Most requested document types this week.</p>
            </div>
            <div className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
              <ShieldCheck className="mr-1 inline h-3.5 w-3.5" />
              {requests.length} total
            </div>
          </div>

          <div className="space-y-4">
            {Object.entries(documentTypeCounts)
              .sort((a, b) => b[1] - a[1])
              .map(([key, count]) => {
                const percent = requests.length ? Math.round((count / requests.length) * 100) : 0;
                return (
                  <div key={key}>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span className="font-medium text-neutral-700 dark:text-neutral-300">{DOCUMENT_LABELS[key] || key}</span>
                      <span className="text-neutral-500">{count} requests</span>
                    </div>
                    <div className="h-2 rounded-full bg-neutral-100 dark:bg-neutral-800">
                      <div className="h-2 rounded-full bg-emerald-600" style={{ width: `${percent}%` }} />
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
}
