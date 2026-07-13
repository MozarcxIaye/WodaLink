import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { ProcurementService } from './procurement.service';
import { CreateRequestDto } from './dto/create-request.dto';
import { AssignRunnerDto } from './dto/assign-runner.dto';
import { UploadScanDto } from './dto/upload-scan.dto';
import { JwtAuthGuard } from '../identity/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('procurement')
export class ProcurementController {
  constructor(private readonly procurementService: ProcurementService) { }

  @Post('request')
  createRequest(@Req() req, @Body() dto: CreateRequestDto) {
    return this.procurementService.create(req.user.userId, dto);
  }

  @Get('requests')
  getAllRequests() {
    return this.procurementService.findAll();
  }

  @Get('request/:id')
  getSingleRequest(@Param('id') id: string) {
    return this.procurementService.findOne(id);
  }

  @Patch('request/:id/assign')
  assignRunner(@Param('id') id: string, @Body() dto: AssignRunnerDto) {
    return this.procurementService.assignRunner(id, dto.runnerId);
  }

  @Patch('request/:id/upload')
  uploadScan(@Req() req, @Param('id') id: string, @Body() dto: UploadScanDto) {
    return this.procurementService.uploadScan(id, req.user.userId, dto);
  }

  @Delete('request/:id')
  cancelRequest(@Req() req, @Param('id') id: string) {
    return this.procurementService.cancel(id, req.user.userId);
  }

  @Get('dashboard')
  getDashboard(@Req() req) {
    return this.procurementService.getUserDashboard(req.user.userId, req.user.role);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('request/:id/start')
  startProcessing(@Req() req, @Param('id') id: string) {
    return this.procurementService.startProcessing(id, req.user.userId);
  }
}