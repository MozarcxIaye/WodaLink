import { useNavigate } from 'react-router';
import { useRequests } from '../../procurement/hooks/use-procurement';
import { useAuth } from '../../../providers/auth-provider';
import { DataTable } from '../../../components/data-table';
import { StatusBadge } from '../../../components/status-badge';
import type { DocumentRequest } from '../../../types';
import { Plus, Loader2 } from 'lucide-react';

export function RequestsList() {
  const { user } = useAuth();
  const { data: requests = [], isLoading } = useRequests();
  const navigate = useNavigate();

  // Filter requests to show only those owned by the current logged-in expat user
  const expatRequests = requests.filter((req) => {
    const expatIdStr = typeof req.expatId === 'object' ? req.expatId?._id : req.expatId;
    return String(expatIdStr) === String(user?._id);
  });

  const columns = [
    {
      header: 'Document Type',
      accessor: (req: DocumentRequest) => (
        <span className="font-bold capitalize">{req.documentType.toLowerCase().replace('_', ' ')}</span>
      ),
    },
    {
      header: 'Ward Code',
      accessor: (req: DocumentRequest) => <span>{req.wardCode}</span>,
    },
    {
      header: 'Escrow Amount',
      accessor: (req: DocumentRequest) => <span className="font-semibold">${req.escrowAmount}</span>,
    },
    {
      header: 'Payment Status',
      accessor: (req: DocumentRequest) => (
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded text-xxs font-semibold border ${
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
      header: 'Workflow Status',
      accessor: (req: DocumentRequest) => <StatusBadge status={req.status} />,
    },
    {
      header: 'Date Created',
      accessor: (req: DocumentRequest) => <span>{new Date(req.createdAt).toLocaleDateString()}</span>,
    },
  ];

  const searchFilter = (req: DocumentRequest, query: string) => {
    return (
      req.documentType.toLowerCase().includes(query.toLowerCase()) ||
      req.wardCode.toLowerCase().includes(query.toLowerCase())
    );
  };

  const handleRowClick = (req: DocumentRequest) => {
    navigate(`/expat/requests/${req._id}`);
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
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-neutral-900 dark:text-white">Procurement Requests</h3>
          <p className="text-xs text-neutral-500">Manage, fund, and track all your document requests in Nepal.</p>
        </div>
        <button
          onClick={() => navigate('/expat/requests/new')}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 py-2 px-4 text-xs font-semibold text-white hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Plus className="h-3.5 w-3.5" />
          Create Request
        </button>
      </div>

      <DataTable
        data={expatRequests}
        columns={columns}
        searchPlaceholder="Filter by document type or ward..."
        searchFilter={searchFilter}
        pageSize={10}
        onRowClick={handleRowClick}
        emptyMessage="You haven't submitted any document procurement requests yet."
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
                <span className="block font-medium">Ward Code</span>
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
