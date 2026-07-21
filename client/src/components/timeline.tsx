import type { RequestStatus } from '../types';
import { Check, X } from 'lucide-react';

interface TimelineProps {
  status: RequestStatus;
}

export function Timeline({ status }: TimelineProps) {
  const isCancelled = status === 'CANCELLED';

  const normalSteps = [
    { key: 'PENDING', label: 'Request Placed' },
    { key: 'ASSIGNED', label: 'Runner Assigned' },
    { key: 'IN_PROGRESS', label: 'In Procurement' },
    { key: 'DOCUMENT_READY', label: 'Document Ready' },
    { key: 'COMPLETED', label: 'Completed' },
  ];

  const cancelledSteps = [
    { key: 'PENDING', label: 'Request Placed' },
    { key: 'CANCELLED', label: 'Cancelled' },
  ];

  const steps = isCancelled ? cancelledSteps : normalSteps;

  const currentStepIndex = steps.findIndex((step) => step.key === status);

  return (
    <div className="w-full py-6">
      <div className="flex items-center">
        {steps.map((step, index) => {
          const isCompleted = index < currentStepIndex;
          const isActive = index === currentStepIndex;
          const isLast = index === steps.length - 1;

          return (
            <div key={step.key} className={`flex items-center ${isLast ? '' : 'flex-1'}`}>
              {/* Step Circle */}
              <div className="relative flex flex-col items-center">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                    isCompleted
                      ? 'border-emerald-500 bg-emerald-500 text-white'
                      : isActive
                      ? isCancelled
                        ? 'border-red-500 bg-red-500 text-white animate-pulse'
                        : 'border-blue-600 bg-blue-600 text-white animate-pulse'
                      : 'border-neutral-300 bg-white text-neutral-500 dark:border-neutral-700 dark:bg-neutral-800'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="h-5 w-5" />
                  ) : isActive && isCancelled ? (
                    <X className="h-5 w-5" />
                  ) : (
                    <span className="text-sm font-semibold">{index + 1}</span>
                  )}
                </div>
                {/* Step Label */}
                <div className="absolute top-12 whitespace-nowrap text-xs font-medium text-neutral-600 dark:text-neutral-400">
                  {step.label}
                </div>
              </div>

              {/* Progress Line */}
              {!isLast && (
                <div
                  className={`mx-4 h-0.5 flex-1 rounded transition-colors duration-500 ${
                    isCompleted
                      ? 'bg-emerald-500'
                      : 'bg-neutral-200 dark:bg-neutral-700'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
      {/* Visual spacer to prevent absolute label overlaps */}
      <div className="h-10"></div>
    </div>
  );
}
