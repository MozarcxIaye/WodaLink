import { Controller, Get, Post, Body, Patch, Param, UseGuards, Req, Query, Delete } from '@nestjs/common';
import { MarketplaceService } from './marketplace.service';
import { UpdateAvailabilityDto } from './dto/update-availability.dto';
import { JwtAuthGuard } from '../identity/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('marketplace')
export class MarketplaceController {
  constructor(private readonly marketplaceService: MarketplaceService) {}

  // Runner updates their operational zone
  @Patch('availability')
  updateAvailability(@Req() req, @Body() dto: UpdateAvailabilityDto) {
    return this.marketplaceService.updateAvailability(req.user.userId, dto);
  }

  // Runner sees nearby job openings matching their region
@Get('jobs')
  getOpenJobs(
    @Req() req, 
    @Query('wardCode') wardCode?: string,
    @Query('municipalityId') municipalityId?: string
  ) {
    return this.marketplaceService.findOpenRequestsForTerritory(req.user.userId, { wardCode, municipalityId });
  }

  // Runner self-claims an available job
  @Post('request/:id/claim')
  claimRequest(@Req() req, @Param('id') id: string) {
    return this.marketplaceService.claimRequest(id, req.user.userId);
  }

  @Delete('request/:id/reject')
  rejectRequest(@Req() req, @Param('id') id: string) {
    return this.marketplaceService.rejectOrReleaseRequest(id, req.user.userId);
  }

}