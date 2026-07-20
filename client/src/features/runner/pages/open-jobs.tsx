import { useOpenJobs, useClaimJob } from '../../marketplace/hooks/use-marketplace';
import { useAuth } from '../../../providers/auth-provider';
import { DataTable } from '../../../components/data-table';
import { StatusBadge } from '../../../components/status-badge';
import type { DocumentRequest } from '../../../types';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';
import { Loader2, MapPin, DollarSign, FileText, HandMetal } from 'lucide-react';

export function OpenJobs() {
  const { user } = useAuth();
  const municipalityId = user?.runnerMetadata?.municipalityId;
  const [showAllJobs, setShowAllJobs] = useState(!municipalityId);
  const activeQuery = showAllJobs ? { showAll: true } : municipalityId ? { municipalityId } : undefined;
  const { data: jobs = [], isLoading, refetch } = useOpenJobs(activeQuery);
  const claimMutation = useClaimJob();

  useEffect(() => {
    setShowAllJobs(!municipalityId);
  }, [municipalityId]);

  const handleClaim = async (jobId: string) => {
    if (!window.confirm('Are you sure you want to claim this procurement job? You will be responsible for physically obtaining the document.')) {
      return;
    }
    try {
      await claimMutation.mutateAsync(jobId);
      toast.success('Job claimed successfully! Navigate to your dashboard to start procurement.');
      refetch();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || 'Failed to claim job. It may already be taken.');
    }
  };

  const columns = [
    {
      header: 'Document Type',
      accessor: (req: DocumentRequest) => (
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-neutral-400" />
          <span className="font-bold capitalize">{req.documentType.toLowerCase().replace('_', ' ')}</span>
        </div>
      ),
    },
    {
      header: 'Ward Code',
      accessor: (req: DocumentRequest) => (
        <div className="flex items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5 text-neutral-400" />
          <span>{req.wardCode}</span>
        </div>
      ),
    },
    {
      header: 'Escrow',
      accessor: (req: DocumentRequest) => (
        <div className="flex items-center gap-1.5">
          <DollarSign className="h-3.5 w-3.5 text-emerald-500" />
          <span className="font-semibold">${req.escrowAmount}</span>
        </div>
      ),
    },
    {
      header: 'Status',
      accessor: (req: DocumentRequest) => <StatusBadge status={req.status} />,
    },
    {
      header: 'Posted',
      accessor: (req: DocumentRequest) => (
        <span className="text-neutral-500">{new Date(req.createdAt).toLocaleDateString()}</span>
      ),
    },
    {
      header: 'Action',
      accessor: (req: DocumentRequest) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleClaim(req._id);
          }}
          disabled={claimMutation.isPending}
          className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 py-1.5 px-3 text-xs font-semibold text-white transition-colors disabled:opacity-50 shadow-sm"
        >
          {claimMutation.isPending ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <HandMetal className="h-3.5 w-3.5" />
          )}
          Claim
        </button>
      ),
    },
  ];

  const searchFilter = (req: DocumentRequest, query: string) => {
    return (
      req.documentType.toLowerCase().includes(query.toLowerCase()) ||
      req.wardCode.toLowerCase().includes(query.toLowerCase())
    );
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h3 className="text-lg font-bold text-neutral-900 dark:text-white">Open Marketplace Jobs</h3>
          <p className="text-xs text-neutral-500">
            Browse procurement requests available in the marketplace. Claim a job to start earning.
            {showAllJobs ? (
              <span className="ml-1 font-semibold text-blue-600 dark:text-blue-400">Showing all open jobs</span>
            ) : user?.runnerMetadata?.municipalityId ? (
              <span className="ml-1">
                Showing jobs for: <span className="font-semibold text-blue-600 dark:text-blue-400">{user.runnerMetadata.municipalityId}</span>
              </span>
            ) : null}
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-full border border-neutral-200 bg-white p-1 dark:border-neutral-800 dark:bg-[#13141b]">
          <button
            type="button"
            onClick={() => setShowAllJobs(false)}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${showAllJobs ? 'text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200' : 'bg-blue-600 text-white'}`}
          >
            My Territory
          </button>
          <button
            type="button"
            onClick={() => setShowAllJobs(true)}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${showAllJobs ? 'bg-blue-600 text-white' : 'text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200'}`}
          >
            Browse All Jobs
          </button>
        </div>
      </div>

      <DataTable
        data={jobs}
        columns={columns}
        searchPlaceholder="Filter by document type or ward code..."
        searchFilter={searchFilter}
        pageSize={10}
        emptyMessage="No open jobs in your territory. Check back soon or update your municipality area."
        renderMobileCard={(req) => (
          <div className="space-y-3">
            <div className="flex justify-between items-start">
              <span className="font-bold text-neutral-900 dark:text-white capitalize">
                {req.documentType.toLowerCase().replace('_', ' ')}
              </span>
              <StatusBadge status={req.status} />
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs border-t border-neutral-100 dark:border-neutral-800 pt-2">
              <div>
                <span className="block text-neutral-500 font-medium">Ward Code</span>
                <span className="font-semibold text-neutral-800 dark:text-neutral-200">{req.wardCode}</span>
              </div>
              <div>
                <span className="block text-neutral-500 font-medium">Escrow</span>
                <span className="font-semibold text-emerald-600">${req.escrowAmount}</span>
              </div>
            </div>
            <button
              onClick={() => handleClaim(req._id)}
              disabled={claimMutation.isPending}
              className="w-full inline-flex items-center justify-center gap-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 py-2 px-4 text-xs font-semibold text-white transition-colors disabled:opacity-50"
            >
              <HandMetal className="h-3.5 w-3.5" />
              Claim This Job
            </button>
          </div>
        )}
      />
    </div>
  );
}
