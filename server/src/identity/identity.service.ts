import { LoginDto } from './dto/login.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { VerifyKycDto } from './dto/verify-kyc.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './entities/user.schema';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class IdentityService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
  ) { }

  async register(dto: RegisterUserDto) {

    const existingUser = await this.userModel.findOne({
      email: dto.email,
    });

    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);

    const user = await this.userModel.create({
      email: dto.email,
      passwordHash,
      name: dto.name,
      role: dto.role,

      ...(dto.role === 'runner'
        ? {
          runnerMetadata: {
            municipalityId: dto.municipalityId,
            rating: 5,
          },
        }
        : {}),
    });

    const payload = {
      sub: String(user._id),
      email: user.email,
      role: user.role,
    };

    return {
      accessToken: this.jwtService.sign(payload),
      email: user.email,
      role: user.role,
      message: "Registered Successfully..."
    };

  }

  async login(dto: LoginDto) {
    const user = await this.userModel.findOne({
      email: dto.email,
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const validPassword = await bcrypt.compare(
      dto.password,
      user.passwordHash,
    );

    if (!validPassword) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      sub: String(user._id),
      email: user.email,
      role: user.role,
    };

    return {
      accessToken: this.jwtService.sign(payload),
      user,
      message: "Logged in Successfully..."
    };
  }

  async verifyKyc(
    userId: string,
    dto: VerifyKycDto,
  ) {
    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new BadRequestException('User not found');
    }

    user.isVerified = true;

    await user.save();

    return {
      message: 'KYC verified successfully',
    };
  }


  async getCurrentUser(userId: string) {
    const user = await this.userModel
      .findById(userId)
      .select('-passwordHash');

    if (!user) {
      throw new BadRequestException('User not found');
    }

    return user;
  }

}
