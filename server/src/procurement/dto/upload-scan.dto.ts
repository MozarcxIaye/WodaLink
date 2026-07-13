import { IsNotEmpty, IsUrl } from 'class-validator';

export class UploadScanDto {
  @IsUrl()
  @IsNotEmpty()
  scanUrl!: string;
}