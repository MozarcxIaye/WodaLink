import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUrl } from 'class-validator';

export class UploadScanDto {
  @ApiProperty({ example: 'https://example.com/scan.jpg', description: 'URL of the uploaded scan' })
  @IsUrl()
  @IsNotEmpty()
  scanUrl!: string;
}