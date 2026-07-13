import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateAvailabilityDto {
  @IsString()
  @IsNotEmpty()
  municipalityId!: string;
}