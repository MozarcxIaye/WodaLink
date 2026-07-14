import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateAvailabilityDto {
  @ApiProperty({ example: 'municipality-123', description: 'Municipality ID to set runner availability' })
  @IsString()
  @IsNotEmpty()
  municipalityId!: string;
}