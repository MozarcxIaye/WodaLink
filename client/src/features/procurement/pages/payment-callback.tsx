import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { toast } from 'sonner';
import { procurementService } from '../services/procurement-service';

export function PaymentCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const status = searchParams.get('status');
    const requestId = searchParams.get('purchase_order_id');
    const pidx = searchParams.get('pidx');

    async function finalizePayment() {
      if (status !== 'Completed' || !requestId || !pidx) {
        toast.error('Payment callback failed or was cancelled.');
        navigate('/expat/dashboard', { replace: true });
        return;
      }

      try {
        toast.success('Khalti payment completed. Finalizing your request...');
        await procurementService.verifyPayment(status, requestId, pidx);
        navigate(`/expat/requests/${requestId}?payment=success`, { replace: true });
      } catch (err: any) {
        const message = err.response?.data?.message || 'Payment verification failed. Please try again.';
        toast.error(message);
        navigate('/expat/dashboard', { replace: true });
      } finally {
        setIsLoading(false);
      }
    }

    finalizePayment();
  }, [navigate, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-[#0b0c10] text-neutral-900 dark:text-neutral-100">
      <div className="rounded-3xl border border-neutral-200/80 bg-white dark:bg-[#14151c] p-10 shadow-lg text-center">
        <h1 className="text-2xl font-semibold mb-3">Processing payment callback...</h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          {isLoading ? 'Please wait while we finalize your document procurement payment.' : 'Redirecting...'}
        </p>
      </div>
    </div>
  );
}
