import { evaluateEscalation } from './escalation.utils';
import { RequestStatus } from './entities/request-status.enum';

describe('evaluateEscalation', () => {
  it('flags stale unassigned pending requests', () => {
    const now = new Date('2026-01-10T12:00:00.000Z');
    const request = {
      status: RequestStatus.PENDING,
      runnerId: null,
      updatedAt: new Date('2026-01-09T12:00:00.000Z'),
    };

    const result = evaluateEscalation(request as any, now);

    expect(result.isEscalated).toBe(true);
    expect(result.escalationReason).toBe('UNASSIGNED_PENDING');
    expect(result.escalationLevel).toBe('high');
  });

  it('flags completed requests that are still unpaid', () => {
    const now = new Date('2026-01-10T12:00:00.000Z');
    const request = {
      status: RequestStatus.COMPLETED,
      isPaid: false,
      updatedAt: new Date('2026-01-09T12:00:00.000Z'),
    };

    const result = evaluateEscalation(request as any, now);

    expect(result.isEscalated).toBe(true);
    expect(result.escalationReason).toBe('PAYMENT_PENDING');
    expect(result.escalationLevel).toBe('high');
  });

  it('does not flag fresh in-progress work', () => {
    const now = new Date('2026-01-10T12:00:00.000Z');
    const request = {
      status: RequestStatus.IN_PROGRESS,
      runnerId: 'runner-1',
      updatedAt: new Date('2026-01-10T09:00:00.000Z'),
    };

    const result = evaluateEscalation(request as any, now);

    expect(result.isEscalated).toBe(false);
  });

  it('keeps resolved requests from being re-flagged', () => {
    const now = new Date('2026-01-10T12:00:00.000Z');
    const request = {
      status: RequestStatus.PENDING,
      runnerId: null,
      updatedAt: new Date('2026-01-09T12:00:00.000Z'),
      resolvedAt: new Date('2026-01-10T10:00:00.000Z'),
    };

    const result = evaluateEscalation(request as any, now);

    expect(result.isEscalated).toBe(false);
    expect(result.escalationReason).toBeNull();
  });
});
