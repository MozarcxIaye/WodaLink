import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { IdentityService } from './identity.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginDto } from './dto/login.dto';

@Controller('identity')
export class IdentityController {
  constructor(private readonly identityService: IdentityService) {}


  @Post('register')
  register(@Body() registerUserDto: RegisterUserDto){
    return this.identityService.register(registerUserDto)
  }

  @Post('login')
  login(@Body() loginUserDto: LoginDto){
    return this.identityService.login(loginUserDto)
  }

  
 
}
