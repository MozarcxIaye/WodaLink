import { useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router';
import { useRequest, useCancelRequest, usePayForRequest } from '../../procurement/hooks/use-procurement';
import { Timeline } from '../../../components/timeline';
import { StatusBadge } from '../../../components/status-badge';
import { RequestActivityFeed } from '../../../components/request-activity-feed';
import { toast } from 'sonner';
import {
  Loader2,
  Landmark,
  DollarSign,
  FileText,
  Calendar,
  AlertCircle,
  Download,
  Trash2,
  CreditCard,
  User as UserIcon,
  CheckCircle,
} from 'lucide-react';

export function RequestDetail() {
  const { id = '' } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const { data: request, isLoading, error } = useRequest(id);
  const cancelMutation = useCancelRequest();
  const payMutation = usePayForRequest();

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel this pending procurement request?')) {
      return;
    }

    try {
      await cancelMutation.mutateAsync(id);
      toast.success('Procurement request cancelled successfully.');
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to cancel request. Please try again.';
      toast.error(message);
    }
  };

  const handlePayment = async () => {
    try {
      const response = await payMutation.mutateAsync(id);
      toast.success('Redirecting to Khalti Sandbox Payment portal...');
      if (response.paymentUrl) {
        window.location.href = response.paymentUrl;
      }
    } catch (err: any) {
      const message = err.response?.data?.message || 'Khalti payment initiation failed. Please try again.';
      toast.error(message);
    }
  };

  useEffect(() => {
    if (searchParams.get('payment') === 'success') {
      toast.success('Payment confirmed successfully!');
      const params = new URLSearchParams(searchParams);
      params.delete('payment');
      navigate({ search: params.toString() }, { replace: true });
    }
  }, [searchParams, navigate]);

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
            <h4 className="font-bold">Request not found</h4>
            <p className="text-sm mt-1">The request may have been deleted or you do not have permission to view it.</p>
            <button
              onClick={() => navigate('/expat/dashboard')}
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
      {/* Workflow Stepper */}
      <div className="bg-white dark:bg-[#13141b] rounded-2xl border border-neutral-200/60 dark:border-neutral-800/80 p-6 shadow-xs">
        <h4 className="text-sm font-semibold text-neutral-400 uppercase tracking-wider mb-6">Procurement Progress</h4>
        <Timeline status={request.status} />
      </div>

      {/* Main Details card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Core Info */}
        <div className="md:col-span-2 bg-white dark:bg-[#13141b] rounded-2xl border border-neutral-200/60 dark:border-neutral-800/80 p-6 shadow-xs space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-neutral-100 dark:border-neutral-800">
            <div>
              <span className="text-xxs font-semibold text-neutral-400 uppercase tracking-wider">Document Request</span>
              <h2 className="text-xl font-bold text-neutral-900 dark:text-white capitalize mt-0.5">
                {request.documentType.toLowerCase().replace('_', ' ')}
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <StatusBadge status={request.status} />
              {request.isPaid ? (
                <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200/50 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20 text-xxs font-medium px-2.5 py-0.5 rounded">
                  <CheckCircle className="h-3 w-3" />
                  Paid Escrow
                </span>
              ) : (
                <span className="bg-rose-50 text-rose-700 border border-rose-200/50 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20 text-xxs font-medium px-2.5 py-0.5 rounded">
                  Unpaid
                </span>
              )}
            </div>
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
                <span className="block text-xs font-medium text-neutral-400 uppercase tracking-wider">Submitted On</span>
                <span className="font-semibold text-neutral-900 dark:text-white">
                  {new Date(request.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <DollarSign className="h-5 w-5 text-neutral-400 shrink-0" />
              <div>
                <span className="block text-xs font-medium text-neutral-400 uppercase tracking-wider">Escrow Amount</span>
                <span className="font-semibold text-neutral-900 dark:text-white">${request.escrowAmount}</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <FileText className="h-5 w-5 text-neutral-400 shrink-0" />
              <div>
                <span className="block text-xs font-medium text-neutral-400 uppercase tracking-wider">Identity/POA Link</span>
                <a
                  href={request.poaUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold text-blue-600 dark:text-blue-400 hover:underline break-all"
                >
                  View Document
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Side Panel: Runner Information & Actions */}
        <div className="bg-white dark:bg-[#13141b] rounded-2xl border border-neutral-200/60 dark:border-neutral-800/80 p-6 shadow-xs flex flex-col justify-between gap-6">
          <div className="space-y-4">
            <h4 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Assigned Runner</h4>
            {request.runnerId ? (
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center font-bold">
                  <UserIcon className="h-5 w-5" />
                </div>
                <div>
                  <span className="block font-bold text-neutral-900 dark:text-white">
                    {typeof request.runnerId === 'object' ? request.runnerId.name : 'Local Runner'}
                  </span>
                  <span className="text-xxs text-neutral-400 uppercase tracking-wider font-semibold">Active Procurement</span>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xl border border-dashed border-neutral-200 dark:border-neutral-800 text-center">
                <p className="text-xs text-neutral-400">No runner assigned yet.</p>
                {request.isPaid && (
                  <p className="text-xxs text-neutral-500 mt-1">Waiting for local runners to claim the job.</p>
                )}
              </div>
            )}
          </div>

          <div className="space-y-2">
            {/* Pay Escrow Button */}
            {!request.isPaid && request.status === 'PENDING' && (
              <button
                onClick={handlePayment}
                disabled={payMutation.isPending}
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 py-2.5 px-4 text-xs font-bold text-white shadow-sm transition-all disabled:opacity-50"
              >
                {payMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <CreditCard className="h-4 w-4" />
                    Pay Escrow (${request.escrowAmount})
                  </>
                )}
              </button>
            )}

            {/* Download scan button */}
            {request.status === 'COMPLETED' && request.scanUrl && (
              <a
                href={request.scanUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-700 py-2.5 px-4 text-xs font-bold text-white shadow-sm transition-all"
              >
                <Download className="h-4 w-4" />
                Download Scan
              </a>
            )}

            {/* Cancel Button */}
            {request.status === 'PENDING' && (
              <button
                onClick={handleCancel}
                disabled={cancelMutation.isPending}
                className="w-full flex items-center justify-center gap-2 rounded-lg border border-red-200 hover:bg-red-50 text-red-600 dark:border-red-900/30 dark:hover:bg-red-500/10 py-2.5 px-4 text-xs font-bold transition-all disabled:opacity-50"
              >
                <Trash2 className="h-4 w-4" />
                Cancel Request
              </button>
            )}

            <button
              onClick={() => navigate('/expat/dashboard')}
              className="w-full text-center py-2 text-xs font-medium text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>

      <RequestActivityFeed request={request} />
    </div>
  );
}
