import type { ReactNode } from 'react';
import type { DocumentRequest } from '../types';
import {
  CheckCircle2,
  Clock3,
  CreditCard,
  PlayCircle,
  UploadCloud,
  UserRound,
  XCircle,
} from 'lucide-react';

interface ActivityEvent {
  title: string;
  description: string;
  timestamp: string;
  state: 'completed' | 'active' | 'pending' | 'cancelled';
  icon: ReactNode;
}

function formatTimestamp(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Pending';
  return date.toLocaleString('en', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

export function RequestActivityFeed({ request }: { request: DocumentRequest }) {
  const events: ActivityEvent[] = [
    {
      title: 'Request created',
      description: 'Your procurement request was submitted and is now visible to runners.',
      timestamp: request.createdAt,
      state: request.status === 'CANCELLED' ? 'cancelled' : 'completed',
      icon: <Clock3 className="h-4 w-4" />,
    },
    {
      title: request.isPaid ? 'Escrow paid' : 'Awaiting escrow payment',
      description: request.isPaid
        ? 'The escrow payment was received and the request is eligible for runner claims.'
        : 'Payment must be completed before the request can move forward.',
      timestamp: request.isPaid ? request.updatedAt : request.createdAt,
      state: request.isPaid ? 'completed' : request.status === 'PENDING' ? 'active' : 'completed',
      icon: <CreditCard className="h-4 w-4" />,
    },
    {
      title: request.runnerId ? 'Runner assigned' : 'Waiting for runner',
      description: request.runnerId
        ? 'A runner has been assigned to the procurement request.'
        : 'The request is still waiting for a runner to claim it.',
      timestamp: request.runnerId ? request.updatedAt : request.createdAt,
      state: request.runnerId ? 'completed' : request.status === 'PENDING' ? 'pending' : 'completed',
      icon: <UserRound className="h-4 w-4" />,
    },
    {
      title: request.status === 'IN_PROGRESS' || request.status === 'COMPLETED' ? 'Procurement started' : 'Ready to start',
      description:
        request.status === 'IN_PROGRESS' || request.status === 'COMPLETED'
          ? 'The assigned runner has begun the procurement workflow.'
          : 'This step becomes active once the runner starts the task.',
      timestamp: request.status === 'IN_PROGRESS' || request.status === 'COMPLETED' ? request.updatedAt : request.createdAt,
      state:
        request.status === 'IN_PROGRESS' || request.status === 'COMPLETED'
          ? 'completed'
          : request.status === 'ASSIGNED'
            ? 'active'
            : 'pending',
      icon: <PlayCircle className="h-4 w-4" />,
    },
    {
      title: request.scanUrl || request.status === 'COMPLETED' ? 'Scan uploaded' : 'Upload pending',
      description:
        request.scanUrl || request.status === 'COMPLETED'
          ? 'The completed document scan has been attached to the request.'
          : 'A final scan will be uploaded once the document is obtained.',
      timestamp: request.scanUrl ? request.updatedAt : request.createdAt,
      state: request.scanUrl || request.status === 'COMPLETED' ? 'completed' : 'pending',
      icon: <UploadCloud className="h-4 w-4" />,
    },
  ];

  if (request.status === 'COMPLETED') {
    events.push({
      title: 'Completed',
      description: 'The procurement workflow finished successfully and the request was completed.',
      timestamp: request.updatedAt,
      state: 'completed',
      icon: <CheckCircle2 className="h-4 w-4" />,
    });
  } else if (request.status === 'CANCELLED') {
    events.push({
      title: 'Cancelled',
      description: 'This request was cancelled before it could be completed.',
      timestamp: request.updatedAt,
      state: 'cancelled',
      icon: <XCircle className="h-4 w-4" />,
    });
  }

  return (
    <div className="rounded-2xl border border-neutral-200/60 bg-white p-6 shadow-xs dark:border-neutral-800/80 dark:bg-[#13141b]">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-neutral-400">Activity Feed</h4>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            A concise record of the request lifecycle and key progress updates.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {events.map((event, index) => {
          const isLast = index === events.length - 1;
          const stateStyles = {
            completed: 'border-emerald-200 bg-emerald-50 text-emerald-600 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400',
            active: 'border-blue-200 bg-blue-50 text-blue-600 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-400',
            pending: 'border-neutral-200 bg-neutral-50 text-neutral-500 dark:border-neutral-700 dark:bg-neutral-900/60 dark:text-neutral-400',
            cancelled: 'border-red-200 bg-red-50 text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400',
          };

          return (
            <div key={`${event.title}-${index}`} className="flex gap-3">
              <div className="flex flex-col items-center">
                <div className={`flex h-9 w-9 items-center justify-center rounded-full border ${stateStyles[event.state]}`}>
                  {event.icon}
                </div>
                {!isLast && <div className="mt-2 h-full w-px bg-neutral-200 dark:bg-neutral-700" />}
              </div>

              <div className="flex-1 rounded-xl border border-neutral-100 bg-neutral-50/70 p-3 dark:border-neutral-800 dark:bg-neutral-900/50">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h5 className="text-sm font-semibold text-neutral-900 dark:text-white">{event.title}</h5>
                  <span className="text-xs text-neutral-500 dark:text-neutral-400">{formatTimestamp(event.timestamp)}</span>
                </div>
                <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-300">{event.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
