import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { IdentityService } from './identity.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { VerifyKycDto } from './dto/verify-kyc.dto';

@ApiTags('Identity')
@Controller('identity')
export class IdentityController {
  constructor(private readonly identityService: IdentityService) { }


  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User registration successful' })
  register(@Body() registerUserDto: RegisterUserDto) {
    return this.identityService.register(registerUserDto)
  }

  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 200, description: 'User successfully logged in' })
  login(@Body() loginUserDto: LoginDto) {
    return this.identityService.login(loginUserDto)
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('verify-kyc')
  @ApiOperation({ summary: 'Submit KYC documents for verification' })
  @ApiResponse({ status: 200, description: 'KYC verification request submitted' })
  verifyKyc(
    @Req() req,
    @Body() dto: VerifyKycDto,
  ) {
    return this.identityService.verifyKyc(req.user.userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('me')
  @ApiOperation({ summary: 'Get current authenticated user details' })
  @ApiResponse({ status: 200, description: 'Returns information about the logged-in user' })
  getCurrentUser(@Req() req) {

    return this.identityService.getCurrentUser(req.user.userId);
  }


}
