import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useCreateRequest } from '../../procurement/hooks/use-procurement';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { Loader2, FileText, Landmark, DollarSign, Link as LinkIcon } from 'lucide-react';

const createRequestSchema = z.object({
  documentType: z.enum(['BIRTH_CERTIFICATE', 'MARRIAGE_CERTIFICATE', 'POLICE_CLEARANCE', 'OTHER'] as const),
  wardCode: z.string().min(2, 'Ward Code must be at least 2 characters long (e.g. Ward-12)'),
  escrowAmount: z.number().min(10, 'Minimum escrow amount is $10').max(5000, 'Maximum escrow amount is $5000'),
  poaUrl: z.string().url('Please enter a valid URL for your proof of address document'),
});

type CreateRequestInput = z.infer<typeof createRequestSchema>;

const DOCUMENT_TYPES = [
  { value: 'BIRTH_CERTIFICATE', label: 'Birth Certificate' },
  { value: 'MARRIAGE_CERTIFICATE', label: 'Marriage Certificate' },
  { value: 'POLICE_CLEARANCE', label: 'Police Clearance Record' },
  { value: 'OTHER', label: 'Other Government / Legal Document' },
];

export function CreateRequest() {
  const navigate = useNavigate();
  const createMutation = useCreateRequest();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateRequestInput>({
    resolver: zodResolver(createRequestSchema),
    defaultValues: {
      escrowAmount: 50,
    },
  });

  const onSubmit = async (data: CreateRequestInput) => {
    try {
      const response = await createMutation.mutateAsync({
        wardCode: data.wardCode,
        documentType: data.documentType,
        poaUrl: data.poaUrl,
        escrowAmount: data.escrowAmount,
      });
      toast.success('Document procurement request created successfully!');
      // Navigate to detail page
      navigate(`/expat/requests/${response._id}`);
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to submit request. Please try again.';
      toast.error(message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h3 className="text-xl font-bold text-neutral-900 dark:text-white">Create Procurement Request</h3>
        <p className="text-sm text-neutral-500">
          Fund an escrow and specify municipal details. A runner in Nepal will claim your job and physically procure the certificate.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white dark:bg-[#13141b] rounded-2xl border border-neutral-200/60 dark:border-neutral-800/80 p-6 md:p-8 space-y-5 shadow-xs">
        {/* Document Type Dropdown */}
        <div>
          <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider mb-1">
            Document Type
          </label>
          <div className="relative">
            <FileText className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
            <select
              {...register('documentType')}
              className={`w-full rounded-lg border bg-white dark:bg-neutral-900 py-2.5 pl-10 pr-4 text-sm outline-none transition-colors appearance-none ${
                errors.documentType
                  ? 'border-red-500 focus:ring-1 focus:ring-red-500'
                  : 'border-neutral-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-neutral-800'
              }`}
            >
              <option value="">Select Document Type</option>
              {DOCUMENT_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
          {errors.documentType && (
            <p className="mt-1 text-xs text-red-500 font-medium">{errors.documentType.message}</p>
          )}
        </div>

        {/* Ward Code */}
        <div>
          <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider mb-1">
            Ward Office / Municipality Location (Ward Code)
          </label>
          <div className="relative">
            <Landmark className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
            <input
              type="text"
              placeholder="e.g. KTM-Ward-12"
              {...register('wardCode')}
              className={`w-full rounded-lg border bg-white dark:bg-neutral-900 py-2.5 pl-10 pr-4 text-sm outline-none transition-colors ${
                errors.wardCode
                  ? 'border-red-500 focus:ring-1 focus:ring-red-500'
                  : 'border-neutral-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-neutral-800'
              }`}
            />
          </div>
          <p className="mt-1 text-xxs text-neutral-400">
            Specify the precise ward code or municipality ID in Nepal where the document exists.
          </p>
          {errors.wardCode && <p className="mt-1 text-xs text-red-500 font-medium">{errors.wardCode.message}</p>}
        </div>

        {/* Escrow Amount */}
        <div>
          <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider mb-1">
            Escrow Budget Amount (USD)
          </label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
            <input
              type="number"
              placeholder="50"
              {...register('escrowAmount', { valueAsNumber: true })}
              className={`w-full rounded-lg border bg-white dark:bg-neutral-900 py-2.5 pl-10 pr-4 text-sm outline-none transition-colors ${
                errors.escrowAmount
                  ? 'border-red-500 focus:ring-1 focus:ring-red-500'
                  : 'border-neutral-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-neutral-800'
              }`}
            />
          </div>
          <p className="mt-1 text-xxs text-neutral-400">
            This amount will be locked in WodaLink escrow and released to the runner upon successful procurement.
          </p>
          {errors.escrowAmount && <p className="mt-1 text-xs text-red-500 font-medium">{errors.escrowAmount.message}</p>}
        </div>

        {/* Proof of Address Document Link */}
        <div>
          <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider mb-1">
            Proof of Address / Identity Document URL
          </label>
          <div className="relative">
            <LinkIcon className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
            <input
              type="text"
              placeholder="https://example.com/my-identity.pdf"
              {...register('poaUrl')}
              className={`w-full rounded-lg border bg-white dark:bg-neutral-900 py-2.5 pl-10 pr-4 text-sm outline-none transition-colors ${
                errors.poaUrl
                  ? 'border-red-500 focus:ring-1 focus:ring-red-500'
                  : 'border-neutral-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-neutral-800'
              }`}
            />
          </div>
          <p className="mt-1 text-xxs text-neutral-400">
            Enter a secure, public document URL containing identity proof/delegation authorization for the runner.
          </p>
          {errors.poaUrl && <p className="mt-1 text-xs text-red-500 font-medium">{errors.poaUrl.message}</p>}
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-4 pt-4 border-t border-neutral-100 dark:border-neutral-800">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 py-2.5 px-6 text-sm font-semibold text-white hover:bg-blue-700 active:bg-blue-800 outline-none transition-all disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Submitting Request...
              </>
            ) : (
              'Submit Request'
            )}
          </button>
          <button
            type="button"
            onClick={() => navigate('/expat/dashboard')}
            className="rounded-lg border border-neutral-200 dark:border-neutral-800 py-2.5 px-4 text-sm font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800/60 transition-all"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
