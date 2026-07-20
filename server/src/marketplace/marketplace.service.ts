import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DocumentRequest } from '../procurement/entities/document-request-schema'; 
import { RequestStatus } from '../procurement/entities/request-status.enum';
import { UpdateAvailabilityDto } from './dto/update-availability.dto';
import { RequestStateService } from '../procurement/request-state.service'; // 💡 Imported the state machine service

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function buildMunicipalityRegex(value?: string) {
  if (!value) return undefined;

  const normalized = value.trim();
  if (!normalized) return undefined;

  const aliases = new Set<string>([normalized]);
  const lookup = normalized.toLowerCase();

  const aliasMap: Record<string, string[]> = {
    ktm: ['KTM', 'Kathmandu'],
    lal: ['LAL', 'Lalitpur'],
    pkh: ['PKH', 'Pokhara'],
    bht: ['BHT', 'Bharatpur'],
    bgn: ['BGN', 'Bhaktapur'],
    kir: ['KIR', 'Kirtipur'],
  };

  const expanded = aliasMap[lookup];
  if (expanded) {
    expanded.forEach((alias) => aliases.add(alias));
  }

  const values = Array.from(aliases).filter(Boolean);
  return values.length > 0 ? new RegExp(`^(${values.map(escapeRegExp).join('|')})`, 'i') : undefined;
}

@Injectable()
export class MarketplaceService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<any>,
    @InjectModel(DocumentRequest.name) private readonly requestModel: Model<any>,
    private readonly stateMachine: RequestStateService, // 💡 Injected the state machine engine
  ) {}

  // 1. Allow a runner to update their territory or toggle their active status
  async updateAvailability(runnerId: string, dto: UpdateAvailabilityDto) {
    const runner = await this.userModel.findById(runnerId);
    if (!runner || runner.role !== 'runner') {
      throw new BadRequestException('Only users with the Runner role can update marketplace availability.');
    }

    // Update their registered territory
    if (runner.runnerMetadata) {
      runner.runnerMetadata.municipalityId = dto.municipalityId;
    }
    
    await runner.save();
    return { message: 'Marketplace availability updated successfully', runnerMetadata: runner.runnerMetadata };
  }

  // 2. Discover open requests within the runner's registered municipality territory
  async findOpenRequestsForTerritory(
    runnerId: string, 
    query: { wardCode?: string; municipalityId?: string; showAll?: boolean }
  ) {
    const runner = await this.userModel.findById(runnerId);
    if (!runner || runner.role !== 'runner') {
      throw new BadRequestException('Only runners can browse open marketplace requests.');
    }

    const filterCriteria: any = { status: RequestStatus.PENDING };

    if (!query.showAll && query.wardCode) {
      filterCriteria.wardCode = query.wardCode;
    } 
    else if (!query.showAll) {
      const municipality = query.municipalityId || runner.runnerMetadata?.municipalityId;
      const municipalityRegex = buildMunicipalityRegex(municipality);
      if (municipalityRegex) {
        filterCriteria.wardCode = municipalityRegex;
      }
    }

    return this.requestModel.find(filterCriteria).sort({ createdAt: -1 }).exec();
  }

  // 3. Self-Service Claiming: The Runner accepts the document job themselves
  async claimRequest(requestId: string, runnerId: string) {
    const request = await this.requestModel.findById(requestId);
    if (!request) throw new NotFoundException('Document request not found');

    // 💡 Day 8 & 14 Check: Let the state machine validate if PENDING -> ASSIGNED is legal
    this.stateMachine.validateTransition(request.status, RequestStatus.ASSIGNED);

    if (String(request.expatId) === String(runnerId)) {
      throw new BadRequestException('Anti-Fraud: You cannot claim your own document request.');
    }

    request.runnerId = runnerId;
    request.status = RequestStatus.ASSIGNED;
    return request.save();
  }

  // 4. Reject/Release Assigned Job
  async rejectOrReleaseRequest(requestId: string, runnerId: string) {
    const request = await this.requestModel.findById(requestId);
    if (!request) throw new NotFoundException('Document request not found');

    // Business Rule Validation
    if (String(request.runnerId) !== String(runnerId)) {
      throw new ForbiddenException('You cannot reject a job that is not assigned to you.');
    }

    // 💡 Day 8 Check: Let the state machine validate if ASSIGNED -> PENDING is legal
    this.stateMachine.validateTransition(request.status, RequestStatus.PENDING);

    // Release the request back into the wild marketplace pond cleanly
    request.runnerId = undefined; 
    request.status = RequestStatus.PENDING; 
    
    return request.save();
  }
}