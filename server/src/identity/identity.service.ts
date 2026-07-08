import { LoginDto } from './dto/login.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { Injectable } from '@nestjs/common';
import { VerifyKycDto } from './dto/verify-kyc.dto';

@Injectable()
export class IdentityService {
  constructor(private readonly identityService: IdentityService) { }

  async register(registerUserDto: RegisterUserDto) {

    if (!registerUserDto.password) {
      throw new Error('Password is required.')
    }
    // const hashedPassword = await bcrypt.hash(registerDto.password, 10)
    // registerDto.password = hashedPassword


  }

  async login(loginUserDto: LoginDto) {

  }

  async verifyKyc(userId: string, verifyKycDto: VerifyKycDto) {

  }

  async getCurrentUser(userId: string) {

  }

}
