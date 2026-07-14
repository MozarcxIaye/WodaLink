import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Query, BadRequestException } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags, ApiParam, ApiQuery } from '@nestjs/swagger';
import { ProcurementService } from './procurement.service';
import { CreateRequestDto } from './dto/create-request.dto';
import { AssignRunnerDto } from './dto/assign-runner.dto';
import { UploadScanDto } from './dto/upload-scan.dto';
import { JwtAuthGuard } from '../identity/guards/jwt-auth.guard';
import { InjectModel } from '@nestjs/mongoose';
import { DocumentRequest, DocumentRequestDocument } from './entities/document-request-schema';
import { PaymentsService } from './payments.service';
import { Model } from 'mongoose';

@ApiTags('Procurement')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('procurement')
export class ProcurementController {
  constructor(
    private readonly procurementService: ProcurementService,
    private readonly paymentsService: PaymentsService,
    @InjectModel(DocumentRequest.name) private readonly requestModel: Model<DocumentRequestDocument>,
  ) { }

  @Post()
  @ApiOperation({ summary: 'Create a new procurement request' })
  @ApiResponse({ status: 201, description: 'Procurement request created successfully' })
  createRequest(@Req() req, @Body() dto: CreateRequestDto) {
    return this.procurementService.create(req.user.userId, dto);
  }

  @Get('requests')
  @ApiOperation({ summary: 'Retrieve all procurement requests' })
  @ApiResponse({ status: 200, description: 'List of procurement requests' })
  getAllRequests() {
    return this.procurementService.findAll();
  }

  @Get('request/:id')
  @ApiOperation({ summary: 'Retrieve a single procurement request by id' })
  @ApiParam({ name: 'id', description: 'ID of the procurement request', type: String })
  @ApiResponse({ status: 200, description: 'Procurement request detail' })
  getSingleRequest(@Param('id') id: string) {
    return this.procurementService.findOne(id);
  }

  @Patch('request/:id/assign')
  @ApiOperation({ summary: 'Assign a runner to a procurement request' })
  @ApiParam({ name: 'id', description: 'ID of the procurement request', type: String })
  @ApiResponse({ status: 200, description: 'Runner assigned successfully' })
  assignRunner(@Param('id') id: string, @Body() dto: AssignRunnerDto) {
    return this.procurementService.assignRunner(id, dto.runnerId);
  }

  @Patch('request/:id/upload')
  @ApiOperation({ summary: 'Upload a scan for a procurement request' })
  @ApiParam({ name: 'id', description: 'ID of the procurement request', type: String })
  @ApiResponse({ status: 200, description: 'Scan uploaded successfully' })
  uploadScan(@Req() req, @Param('id') id: string, @Body() dto: UploadScanDto) {
    return this.procurementService.uploadScan(id, req.user.userId, dto);
  }

  @Delete('request/:id')
  @ApiOperation({ summary: 'Cancel a procurement request' })
  @ApiParam({ name: 'id', description: 'ID of the procurement request', type: String })
  @ApiResponse({ status: 200, description: 'Procurement request canceled successfully' })
  cancelRequest(@Req() req, @Param('id') id: string) {
    return this.procurementService.cancel(id, req.user.userId);
  }

  @Get('dashboard')
  @ApiOperation({ summary: 'Get the dashboard for the current user' })
  @ApiResponse({ status: 200, description: 'Dashboard data for the user' })
  getDashboard(@Req() req) {
    return this.procurementService.getUserDashboard(req.user.userId, req.user.role);
  }

  @Patch('request/:id/start')
  @ApiOperation({ summary: 'Start processing a procurement request' })
  @ApiParam({ name: 'id', description: 'ID of the procurement request', type: String })
  @ApiResponse({ status: 200, description: 'Procurement workflow started' })
  startProcessing(@Req() req, @Param('id') id: string) {
    return this.procurementService.startProcessing(id, req.user.userId);
  }


  @Post('request/:id/pay')
  @ApiOperation({ summary: 'Initiate payment for a request' })
  @ApiParam({ name: 'id', description: 'ID of the procurement request', type: String })
  @ApiResponse({ status: 200, description: 'Payment initiation response' })
  async payForRequest(@Param('id') id: string) {
    const request = await this.procurementService.findOne(id);

    if (!request.escrowAmount || request.escrowAmount <= 0) {
      throw new BadRequestException('This request does not have a valid escrow amount set.');
    }

    return this.paymentsService.initiateKhaltiPayment(id, request.escrowAmount);
  }

  @Get('payment/callback')
  @ApiOperation({ summary: 'Handle Khalti payment callback' })
  @ApiQuery({ name: 'status', required: true, description: 'Payment status returned from Khalti' })
  @ApiQuery({ name: 'purchase_order_id', required: true, description: 'Original request id' })
  @ApiQuery({ name: 'pidx', required: true, description: 'Khalti payment id' })
  @ApiResponse({ status: 200, description: 'Payment callback processed successfully' })
  async handleKhaltiCallback(
    @Query('status') status: string,
    @Query('purchase_order_id') requestId: string,
    @Query('pidx') pidx: string,
  ) {
    if (status !== 'Completed') {
      throw new BadRequestException(`Payment was not successful. Current status: ${status}`);
    }

    // 💡 Day 14 Flag Update: Instantly flip the visibility flag to unlock it for runners
    const updatedRequest = await this.requestModel.findByIdAndUpdate(
      requestId,
      { isPaid: true },
      { new: true }
    );

    if (!updatedRequest) throw new BadRequestException('Request mismatch or not found.');

    return {
      message: 'Payment verified and document request released to the marketplace successfully!',
      requestId: updatedRequest._id,
      isPaid: updatedRequest.isPaid,
    };
  }

}