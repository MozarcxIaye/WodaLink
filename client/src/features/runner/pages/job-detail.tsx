import { useParams, useNavigate } from 'react-router';
import { useRequest, useStartProcessing, useUploadScan, useMarkDocumentReady } from '../../procurement/hooks/use-procurement';
import { useRejectJob } from '../../marketplace/hooks/use-marketplace';
import { Timeline } from '../../../components/timeline';
import { StatusBadge } from '../../../components/status-badge';
import { RequestActivityFeed } from '../../../components/request-activity-feed';
import { toast } from 'sonner';
import { useState } from 'react';
import {
  Loader2,
  AlertCircle,
  Landmark,
  Calendar,
  DollarSign,
  FileText,
  Play,
  Upload,
  XCircle,
  CheckCircle2,
  Link as LinkIcon,
} from 'lucide-react';
import { formatUsd, formatNpr, usdToNpr } from '../../../utils/currency';

export function JobDetail() {
  const { id = '' } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: request, isLoading, error } = useRequest(id);
  const startMutation = useStartProcessing();
  const uploadMutation = useUploadScan();
  const rejectMutation = useRejectJob();
  const markReadyMutation = useMarkDocumentReady();
  const [scanUrl, setScanUrl] = useState('');

  const handleStart = async () => {
    try {
      await startMutation.mutateAsync(id);
      toast.success('Procurement started! Upload the scan once you have the document.');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || 'Failed to start procurement.');
    }
  };

  const handleUploadScan = async () => {
    if (!scanUrl || scanUrl.trim() === '') {
      toast.error('Please enter the scanned document URL.');
      return;
    }
    try {
      await uploadMutation.mutateAsync({ id, scanUrl });
      toast.success('Document scan uploaded! Job marked as completed.');
      setScanUrl('');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || 'Failed to upload scan.');
    }
  };

  const handleMarkReady = async () => {
    if (!window.confirm('Mark the document as ready? The expat will be notified to proceed with payment before you can upload the final scan.')) {
      return;
    }
    try {
      await markReadyMutation.mutateAsync(id);
      toast.success('Document marked as ready! Waiting for expat payment to complete.');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || 'Failed to mark document as ready.');
    }
  };

  const handleReject = async () => {
    if (!window.confirm('Are you sure you want to release this job? It will become available to other runners.')) {
      return;
    }
    try {
      await rejectMutation.mutateAsync(id);
      toast.success('Job released back to the marketplace.');
      navigate('/runner/dashboard');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || 'Failed to release job.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (error || !request) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-900/30 dark:bg-red-500/10 dark:text-red-400">
        <div className="flex gap-3">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <div>
            <h4 className="font-bold">Job not found</h4>
            <p className="text-sm mt-1">This job may have been reassigned or doesn't exist.</p>
            <button
              onClick={() => navigate('/runner/dashboard')}
              className="mt-3 inline-flex items-center text-xs font-semibold underline"
            >
              Back to dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Timeline */}
      <div className="bg-white dark:bg-[#13141b] rounded-2xl border border-neutral-200/60 dark:border-neutral-800/80 p-6 shadow-xs">
        <h4 className="text-sm font-semibold text-neutral-400 uppercase tracking-wider mb-6">Procurement Progress</h4>
        <Timeline status={request.status} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Job Details */}
        <div className="md:col-span-2 bg-white dark:bg-[#13141b] rounded-2xl border border-neutral-200/60 dark:border-neutral-800/80 p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-neutral-100 dark:border-neutral-800">
            <div>
              <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Procurement Job</span>
              <h2 className="text-xl font-bold text-neutral-900 dark:text-white capitalize mt-0.5">
                {request.documentType.toLowerCase().replace('_', ' ')}
              </h2>
            </div>
            <StatusBadge status={request.status} />
          </div>

          <div className="grid grid-cols-2 gap-6 text-sm">
            <div className="flex items-start gap-2.5">
              <Landmark className="h-5 w-5 text-neutral-400 shrink-0" />
              <div>
                <span className="block text-xs font-medium text-neutral-400 uppercase tracking-wider">Ward Location</span>
                <span className="font-semibold text-neutral-900 dark:text-white">{request.wardCode}</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Calendar className="h-5 w-5 text-neutral-400 shrink-0" />
              <div>
                <span className="block text-xs font-medium text-neutral-400 uppercase tracking-wider">Date Submitted</span>
                <span className="font-semibold text-neutral-900 dark:text-white">
                  {new Date(request.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <DollarSign className="h-5 w-5 text-neutral-400 shrink-0" />
              <div>
                <span className="block text-xs font-medium text-neutral-400 uppercase tracking-wider">Escrow Payout</span>
                <span className="font-semibold text-emerald-600">
                  {formatNpr(usdToNpr(request.escrowAmount))}
                  <span className="text-neutral-400 font-normal ml-1">
                    ({formatUsd(request.escrowAmount)})
                  </span>
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <FileText className="h-5 w-5 text-neutral-400 shrink-0" />
              <div>
                <span className="block text-xs font-medium text-neutral-400 uppercase tracking-wider">Client's POA</span>
                <a
                  href={request.poaUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold text-blue-600 dark:text-blue-400 hover:underline break-all"
                >
                  View Identity Doc
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Action Panel */}
        <div className="bg-white dark:bg-[#13141b] rounded-2xl border border-neutral-200/60 dark:border-neutral-800/80 p-6 shadow-xs flex flex-col justify-between gap-6">
          <div className="space-y-4">
            <h4 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Runner Actions</h4>

            {/* Start Procurement Button */}
            {request.status === 'ASSIGNED' && (
              <button
                onClick={handleStart}
                disabled={startMutation.isPending}
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 py-2.5 px-4 text-xs font-bold text-white shadow-sm transition-all disabled:opacity-50"
              >
                {startMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
                Start Procurement
              </button>
            )}

            {/* Mark Document as Ready Button */}
            {request.status === 'IN_PROGRESS' && (
              <button
                onClick={handleMarkReady}
                disabled={markReadyMutation.isPending}
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-cyan-600 hover:bg-cyan-700 py-2.5 px-4 text-xs font-bold text-white shadow-sm transition-all disabled:opacity-50"
              >
                {markReadyMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <CheckCircle2 className="h-4 w-4" />
                )}
                Mark Document as Ready
              </button>
            )}

            {/* Upload Scan (only after payment) */}
            {request.status === 'DOCUMENT_READY' && request.isPaid && (
              <div className="space-y-3">
                <p className="text-xs text-neutral-500">
                  Payment confirmed! Upload the final scan to complete this job.
                </p>
                <div className="relative">
                  <LinkIcon className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
                  <input
                    type="text"
                    value={scanUrl}
                    onChange={(e) => setScanUrl(e.target.value)}
                    placeholder="https://example.com/scan.jpg"
                    className="w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <button
                  onClick={handleUploadScan}
                  disabled={uploadMutation.isPending}
                  className="w-full flex items-center justify-center gap-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 py-2.5 px-4 text-xs font-bold text-white shadow-sm transition-all disabled:opacity-50"
                >
                  {uploadMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Upload className="h-4 w-4" />
                  )}
                  Upload Scan & Complete
                </button>
              </div>
            )}

            {/* Awaiting Payment Message */}
            {request.status === 'DOCUMENT_READY' && !request.isPaid && (
              <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200/40 dark:border-amber-500/20 text-center">
                <p className="text-sm font-semibold text-amber-700 dark:text-amber-400">
                  ⏳ Awaiting Payment
                </p>
                <p className="text-xs text-amber-600 dark:text-amber-500 mt-1">
                  The expat has been notified. Once they pay the escrow, you can upload the final scan.
                </p>
              </div>
            )}

            {/* Completed Message */}
            {request.status === 'COMPLETED' && (
              <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200/40 dark:border-emerald-500/20 text-center">
                <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                  ✓ Job completed successfully!
                </p>
                <p className="text-xs text-emerald-600 dark:text-emerald-500 mt-1">Escrow payout will be released.</p>
              </div>
            )}

            {/* Reject/Release Button */}
            {request.status === 'ASSIGNED' && (
              <button
                onClick={handleReject}
                disabled={rejectMutation.isPending}
                className="w-full flex items-center justify-center gap-2 rounded-lg border border-red-200 hover:bg-red-50 text-red-600 dark:border-red-900/30 dark:hover:bg-red-500/10 py-2.5 px-4 text-xs font-bold transition-all disabled:opacity-50"
              >
                <XCircle className="h-4 w-4" />
                Release Job
              </button>
            )}
          </div>

          <button
            onClick={() => navigate('/runner/dashboard')}
            className="w-full text-center py-2 text-xs font-medium text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
          >
            Back to Dashboard
          </button>
        </div>
      </div>

      <RequestActivityFeed request={request} />
    </div>
  );
}
