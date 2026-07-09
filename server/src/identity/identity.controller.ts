import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { IdentityService } from './identity.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { VerifyKycDto } from './dto/verify-kyc.dto';

@Controller('identity')
export class IdentityController {
  constructor(private readonly identityService: IdentityService) { }


  @Post('register')
  register(@Body() registerUserDto: RegisterUserDto) {
    return this.identityService.register(registerUserDto)
  }

  @Post('login')
  login(@Body() loginUserDto: LoginDto) {
    return this.identityService.login(loginUserDto)
  }

  @UseGuards(JwtAuthGuard)
  @Post('verify-kyc')
  verifyKyc(
    @Req() req,
    @Body() dto: VerifyKycDto,
  ) {
    return this.identityService.verifyKyc(req.user.userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getCurrentUser(@Req() req) {

    return this.identityService.getCurrentUser(req.user.userId);
  }



}
