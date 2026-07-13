import { Injectable, BadRequestException } from '@nestjs/common';
import { RequestStatus } from './entities/request-status.enum';

@Injectable()
export class RequestStateService {
  // TypeScript is happy now—every enum option maps to an array of valid targets!
  private readonly transitions: Record<RequestStatus, RequestStatus[]> = {
    [RequestStatus.PENDING]: [RequestStatus.ASSIGNED, RequestStatus.CANCELLED],
    
    // If a runner claims a job, they can kick it into production mode
    [RequestStatus.ASSIGNED]: [RequestStatus.IN_PROGRESS, RequestStatus.PENDING],
    
    // From work-in-progress, they either finish up or hand it back if things break
    [RequestStatus.IN_PROGRESS]: [RequestStatus.COMPLETED, RequestStatus.PENDING],
    
    [RequestStatus.COMPLETED]: [], // Dead-end terminal state
    [RequestStatus.CANCELLED]: [], // Dead-end terminal state
  };

  /**
   * Validates and verifies if a state transition is legal.
   * Throws an exception instantly if it violates business rule constraints.
   */
  validateTransition(currentStatus: RequestStatus, nextStatus: RequestStatus): void {
    if (currentStatus === nextStatus) return;

    const allowedTransitions = this.transitions[currentStatus];

    if (!allowedTransitions || !allowedTransitions.includes(nextStatus)) {
      throw new BadRequestException(
        `Invalid State Transition: Cannot shift a document request from status [${currentStatus}] to status [${nextStatus}].`
      );
    }
  }
}