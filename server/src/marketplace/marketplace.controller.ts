import { Controller, Get, Post, Body, Patch, Param, UseGuards, Req, Query, Delete } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags, ApiParam, ApiQuery } from '@nestjs/swagger';
import { MarketplaceService } from './marketplace.service';
import { UpdateAvailabilityDto } from './dto/update-availability.dto';
import { JwtAuthGuard } from '../identity/guards/jwt-auth.guard';

@ApiTags('Marketplace')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('marketplace')
export class MarketplaceController {
  constructor(private readonly marketplaceService: MarketplaceService) {}

  // Runner updates their operational zone
  @Patch('availability')
  @ApiOperation({ summary: 'Update runner availability for a municipality' })
  @ApiResponse({ status: 200, description: 'Runner availability updated successfully' })
  updateAvailability(@Req() req, @Body() dto: UpdateAvailabilityDto) {
    return this.marketplaceService.updateAvailability(req.user.userId, dto);
  }

  // Runner sees nearby job openings matching their region
  @Get('jobs')
  @ApiOperation({ summary: 'List available jobs for the runner in a territory' })
  @ApiQuery({ name: 'wardCode', required: false, description: 'Optional ward code to filter jobs' })
  @ApiQuery({ name: 'municipalityId', required: false, description: 'Optional municipality ID to filter jobs' })
  @ApiResponse({ status: 200, description: 'Returns open jobs for the runner' })
  getOpenJobs(
    @Req() req, 
    @Query('wardCode') wardCode?: string,
    @Query('municipalityId') municipalityId?: string
  ) {
    return this.marketplaceService.findOpenRequestsForTerritory(req.user.userId, { wardCode, municipalityId });
  }

  // Runner self-claims an available job
  @Post('request/:id/claim')
  @ApiOperation({ summary: 'Claim an available procurement request' })
  @ApiParam({ name: 'id', description: 'ID of the procurement request to claim', type: String })
  @ApiResponse({ status: 200, description: 'Request claimed successfully' })
  claimRequest(@Req() req, @Param('id') id: string) {
    return this.marketplaceService.claimRequest(id, req.user.userId);
  }

  @Delete('request/:id/reject')
  @ApiOperation({ summary: 'Reject or release an assigned procurement request' })
  @ApiParam({ name: 'id', description: 'ID of the procurement request to reject', type: String })
  @ApiResponse({ status: 200, description: 'Request rejected or released successfully' })
  rejectRequest(@Req() req, @Param('id') id: string) {
    return this.marketplaceService.rejectOrReleaseRequest(id, req.user.userId);
  }

}