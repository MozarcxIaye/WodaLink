import { useRequests } from '../../procurement/hooks/use-procurement';
import { DataTable } from '../../../components/data-table';
import { StatusBadge } from '../../../components/status-badge';
import type { DocumentRequest } from '../../../types';
import { Loader2 } from 'lucide-react';

export function AdminRequestsList() {
  const { data: requests = [], isLoading } = useRequests();

  const columns = [
    {
      header: 'Document Type',
      accessor: (req: DocumentRequest) => (
        <span className="font-bold capitalize">{req.documentType.toLowerCase().replace('_', ' ')}</span>
      ),
    },
    {
      header: 'Ward',
      accessor: (req: DocumentRequest) => <span>{req.wardCode}</span>,
    },
    {
      header: 'Escrow',
      accessor: (req: DocumentRequest) => <span className="font-semibold">${req.escrowAmount}</span>,
    },
    {
      header: 'Payment',
      accessor: (req: DocumentRequest) => (
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold border ${
            req.isPaid
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200/50 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20'
              : 'bg-rose-50 text-rose-700 border-rose-200/50 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20'
          }`}
        >
          {req.isPaid ? 'Paid' : 'Unpaid'}
        </span>
      ),
    },
    {
      header: 'Status',
      accessor: (req: DocumentRequest) => <StatusBadge status={req.status} />,
    },
    {
      header: 'Created',
      accessor: (req: DocumentRequest) => (
        <span className="text-neutral-500">{new Date(req.createdAt).toLocaleDateString()}</span>
      ),
    },
  ];

  const searchFilter = (req: DocumentRequest, query: string) => {
    return (
      req.documentType.toLowerCase().includes(query.toLowerCase()) ||
      req.wardCode.toLowerCase().includes(query.toLowerCase()) ||
      req.status.toLowerCase().includes(query.toLowerCase())
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
      <div>
        <h3 className="text-lg font-bold text-neutral-900 dark:text-white">All Platform Requests</h3>
        <p className="text-xs text-neutral-500">
          Global view of all procurement requests on the WodaLink platform. Total: {requests.length} requests.
        </p>
      </div>

      <DataTable
        data={requests}
        columns={columns}
        searchPlaceholder="Search by document type, ward, or status..."
        searchFilter={searchFilter}
        pageSize={15}
        emptyMessage="No procurement requests on the platform yet."
        renderMobileCard={(req) => (
          <div className="space-y-3">
            <div className="flex justify-between items-start">
              <span className="font-bold text-neutral-900 dark:text-white capitalize">
                {req.documentType.toLowerCase().replace('_', ' ')}
              </span>
              <StatusBadge status={req.status} />
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs border-t border-neutral-100 dark:border-neutral-800 pt-2 text-neutral-500">
              <div>
                <span className="block font-medium">Ward</span>
                <span className="font-semibold text-neutral-800 dark:text-neutral-200">{req.wardCode}</span>
              </div>
              <div>
                <span className="block font-medium">Escrow</span>
                <span className="font-semibold text-neutral-800 dark:text-neutral-200">${req.escrowAmount}</span>
              </div>
              <div>
                <span className="block font-medium">Payment</span>
                <span className={`font-semibold ${req.isPaid ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {req.isPaid ? 'Paid' : 'Unpaid'}
                </span>
              </div>
              <div>
                <span className="block font-medium">Created</span>
                <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                  {new Date(req.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        )}
      />
    </div>
  );
}
