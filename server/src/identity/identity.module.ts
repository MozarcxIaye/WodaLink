import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { IdentityService } from './identity.service';
import { IdentityController } from './identity.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';


@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        // secret: process.env.SECRET_KEY,
          secret: configService.get<string>('SECRET_KEY'),
          signOptions: { expiresIn: '15m' }

      })
    })
  ],
  controllers: [IdentityController],
  providers: [IdentityService, JwtStrategy],
})
export class IdentityModule { }
