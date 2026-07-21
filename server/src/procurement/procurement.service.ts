import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreateRequestDto } from './dto/create-request.dto';
import { RequestStatus } from './entities/request-status.enum';
import { UploadScanDto } from './dto/upload-scan.dto';
import { DocumentRequest, DocumentRequestDocument } from './entities/document-request-schema';
import { RequestStateService } from './request-state.service';
import { evaluateEscalation } from './escalation.utils';

@Injectable()
export class ProcurementService {
  constructor(
    @InjectModel(DocumentRequest.name)
    private readonly requestModel: Model<DocumentRequestDocument>,
    private readonly stateMachine: RequestStateService, // 💡 Inject the state machine provider
  ) {}

  async create(expatId: string, dto: CreateRequestDto) {
    return this.requestModel.create({
      ...dto,
      expatId,
      status: RequestStatus.PENDING,
    });
  }

  async findAll() {
    return this.requestModel.find().exec();
  }

  async getEscalations() {
    const requests = await this.requestModel.find().sort({ updatedAt: -1 }).exec();

    return requests.map((request) => {
      const evaluation = evaluateEscalation(request);
      const shouldEscalate = request.isEscalated || evaluation.isEscalated;
      return {
        ...request.toObject(),
        isEscalated: shouldEscalate,
        escalationReason: request.escalationReason || evaluation.escalationReason || undefined,
        escalationLevel: request.escalationLevel || evaluation.escalationLevel || 'medium',
        escalatedAt: request.escalatedAt ? request.escalatedAt.toISOString() : undefined,
      };
    }).filter((request) => request.isEscalated);
  }

  async escalateRequest(id: string, adminNote?: string) {
    const request = await this.findOne(id);
    const evaluation = evaluateEscalation(request);

    request.isEscalated = true;
    request.escalationReason = request.escalationReason || evaluation.escalationReason || 'MANUAL';
    request.escalationLevel = request.escalationLevel || evaluation.escalationLevel || 'high';
    request.adminNote = adminNote || request.adminNote;
    request.escalatedAt = request.escalatedAt || new Date();
    request.resolvedAt = undefined;
    return request.save();
  }

  async resolveEscalation(id: string, adminNote?: string) {
    const request = await this.findOne(id);
    request.isEscalated = false;
    request.escalationReason = undefined;
    request.escalationLevel = undefined;
    request.adminNote = adminNote || request.adminNote;
    request.escalatedAt = undefined;
    request.resolvedAt = new Date();
    return request.save();
  }

  async findOne(id: string) {
    const request = await this.requestModel.findById(id).exec();
    if (!request) throw new NotFoundException('Document request not found');
    return request;
  }

  async assignRunner(requestId: string, runnerId: string) {
    const request = await this.findOne(requestId);

    // 💡 Day 8 Validation: Ensure transition to ASSIGNED is legal
    this.stateMachine.validateTransition(request.status, RequestStatus.ASSIGNED);

    if (String(request.expatId) === String(runnerId)) {
      throw new BadRequestException('Conflict: An Expat cannot be assigned as the Runner for their own request.');
    }

    request.runnerId = runnerId;
    request.status = RequestStatus.ASSIGNED;
    return request.save();
  }

  // 💡 NEW METHOD: Moves the request from ASSIGNED -> IN_PROGRESS
  async startProcessing(requestId: string, runnerId: string) {
    const request = await this.findOne(requestId);

    if (String(request.runnerId) !== String(runnerId)) {
      throw new ForbiddenException('You are not the assigned runner for this request');
    }

    // 💡 Day 8 Validation: Enforce state machine checks for IN_PROGRESS tracking
    this.stateMachine.validateTransition(request.status, RequestStatus.IN_PROGRESS);

    request.status = RequestStatus.IN_PROGRESS;
    return request.save();
  }

  async markDocumentReady(requestId: string, runnerId: string) {
    const request = await this.findOne(requestId);

    if (String(request.runnerId) !== String(runnerId)) {
      throw new ForbiddenException('You are not the assigned runner for this request');
    }

    this.stateMachine.validateTransition(request.status, RequestStatus.DOCUMENT_READY);

    request.status = RequestStatus.DOCUMENT_READY;
    return request.save();
  }

  async uploadScan(requestId: string, runnerId: string, dto: UploadScanDto) {
    const request = await this.findOne(requestId);

    if (String(request.runnerId) !== String(runnerId)) {
      throw new ForbiddenException('You are not the assigned runner for this request');
    }

    if (!request.isPaid) {
      throw new BadRequestException('Cannot upload scan until the expat has paid the escrow.');
    }

    this.stateMachine.validateTransition(request.status, RequestStatus.COMPLETED);

    request.scanUrl = dto.scanUrl;
    request.status = RequestStatus.COMPLETED;
    return request.save();
  }

  async cancel(id: string, expatId: string) {
    const request = await this.findOne(id);

    if (String(request.expatId) !== String(expatId)) {
      throw new ForbiddenException('You do not own this document request');
    }

    // 💡 Day 8 Validation: Enforce state machine checks for CANCELLED state transitions
    this.stateMachine.validateTransition(request.status, RequestStatus.CANCELLED);

    request.status = RequestStatus.CANCELLED;
    return request.save();
  }

  // Add this method inside your ProcurementService class:
async getUserDashboard(userId: string, role: string) {
  // If the logged-in user is a Runner, show their active operations pipeline
  if (role === 'runner') {
    const activeJobs = await this.requestModel.find({
      runnerId: userId,
      status: { $in: [RequestStatus.ASSIGNED, RequestStatus.IN_PROGRESS, RequestStatus.DOCUMENT_READY] }
    }).sort({ updatedAt: -1 }).exec();

    const completedJobs = await this.requestModel.find({
      runnerId: userId,
      status: RequestStatus.COMPLETED
    }).sort({ updatedAt: -1 }).limit(10).exec(); // Limit history count for performance

    return {
      summary: {
        activeCount: activeJobs.length,
        completedTotal: completedJobs.length,
      },
      activeJobs,
      completedHistory: completedJobs
    };
  }

  // Otherwise, the user is an Expat client. Show their document orders status tracker.
  const openRequests = await this.requestModel.find({
    expatId: userId,
    status: { $in: [RequestStatus.PENDING, RequestStatus.ASSIGNED, RequestStatus.IN_PROGRESS, RequestStatus.DOCUMENT_READY] }
  }).sort({ createdAt: -1 }).exec();

  const historicRequests = await this.requestModel.find({
    expatId: userId,
    status: { $in: [RequestStatus.COMPLETED, RequestStatus.CANCELLED] }
  }).sort({ updatedAt: -1 }).limit(10).exec();

  return {
    summary: {
      pendingApprovalCount: openRequests.filter(r => r.status === RequestStatus.PENDING).length,
      activeProcessingCount: openRequests.filter(r => r.status !== RequestStatus.PENDING).length,
    },
    openRequests,
    history: historicRequests
  };
}

}