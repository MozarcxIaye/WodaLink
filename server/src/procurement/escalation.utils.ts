import { RequestStatus } from './entities/request-status.enum';

const ESCALATION_WINDOW_MS = 24 * 60 * 60 * 1000;

export interface EscalationEvaluation {
  isEscalated: boolean;
  escalationReason: string | null;
  escalationLevel: 'medium' | 'high' | null;
}

export function evaluateEscalation(request: any, now: Date = new Date()): EscalationEvaluation {
  if (request.resolvedAt) {
    return {
      isEscalated: false,
      escalationReason: null,
      escalationLevel: null,
    };
  }

  const updatedAt = request.updatedAt ? new Date(request.updatedAt) : new Date();
  const stale = now.getTime() - updatedAt.getTime() >= ESCALATION_WINDOW_MS;

  if (request.status === RequestStatus.PENDING && !request.runnerId && stale) {
    return {
      isEscalated: true,
      escalationReason: 'UNASSIGNED_PENDING',
      escalationLevel: 'high',
    };
  }

  if (request.status === RequestStatus.COMPLETED && !request.isPaid) {
    return {
      isEscalated: true,
      escalationReason: 'PAYMENT_PENDING',
      escalationLevel: 'high',
    };
  }

  if (request.status === RequestStatus.ASSIGNED || request.status === RequestStatus.IN_PROGRESS) {
    if (stale) {
      return {
        isEscalated: true,
        escalationReason: 'STALE_PROGRESS',
        escalationLevel: 'medium',
      };
    }
  }

  return {
    isEscalated: false,
    escalationReason: null,
    escalationLevel: null,
  };
}
