import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreateRequestDto } from './dto/create-request.dto';
import { RequestStatus } from './entities/request-status.enum';
import { UploadScanDto } from './dto/upload-scan.dto';
import { DocumentRequest, DocumentRequestDocument } from './entities/document-request-schema';

@Injectable()
export class ProcurementService {
  constructor(
    @InjectModel(DocumentRequest.name)
    private readonly requestModel: Model<DocumentRequestDocument>,
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

  async findOne(id: string) {
    const request = await this.requestModel.findById(id).exec();
    if (!request) throw new NotFoundException('Document request not found');
    return request;
  }

  async assignRunner(requestId: string, runnerId: string) {
    const request = await this.findOne(requestId);

    if (String(request.expatId) === String(runnerId)) {
      throw new BadRequestException('Conflict: An Expat cannot be assigned as the Runner for their own request.');
    }

    request.runnerId = runnerId;
    request.status = RequestStatus.ASSIGNED;
    return request.save();
  }

  async uploadScan(requestId: string, runnerId: string, dto: UploadScanDto) {
    const request = await this.findOne(requestId);

    if (request.runnerId !== runnerId) {
      throw new ForbiddenException('You are not the assigned runner for this request');
    }

    request.scanUrl = dto.scanUrl;
    request.status = RequestStatus.COMPLETED;
    return request.save();
  }

  // 💡 AMENDED: Cancel method with full ownership and lifecycle protection guards
  async cancel(id: string, expatId: string) {
    const request = await this.findOne(id);

    // Guard 1: Ensure only the original expat client can cancel it
    if (String(request.expatId) !== String(expatId)) {
      throw new ForbiddenException('You do not own this document request');
    }

    // Guard 2: Prevent cancellation if a runner has already been deployed
    if (request.status !== RequestStatus.PENDING) {
      throw new BadRequestException(`Cannot cancel a request that is already ${request.status}`);
    }

    request.status = RequestStatus.CANCELLED;
    return request.save();
  }
}