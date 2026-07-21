import { Injectable, BadRequestException } from '@nestjs/common';
import { RequestStatus } from './entities/request-status.enum';

@Injectable()
export class RequestStateService {
  // TypeScript is happy now—every enum option maps to an array of valid targets!
  private readonly transitions: Record<RequestStatus, RequestStatus[]> = {
    [RequestStatus.PENDING]: [RequestStatus.ASSIGNED, RequestStatus.CANCELLED],
  
    [RequestStatus.ASSIGNED]: [RequestStatus.IN_PROGRESS, RequestStatus.PENDING],
    
    [RequestStatus.IN_PROGRESS]: [RequestStatus.DOCUMENT_READY, RequestStatus.PENDING],
    
    [RequestStatus.DOCUMENT_READY]: [RequestStatus.COMPLETED, RequestStatus.PENDING],
    
    [RequestStatus.COMPLETED]: [],
    [RequestStatus.CANCELLED]: [],
  };


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