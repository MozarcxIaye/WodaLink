import { IsEnum, IsNotEmpty, IsNumber, IsString, IsUrl, Min } from 'class-validator';
import { DocumentType } from '../entities/request-status.enum';

export class CreateRequestDto {
  @IsString()
  @IsNotEmpty()
  wardCode!: string;

  @IsEnum(DocumentType)
  documentType!: DocumentType;

  @IsUrl()
  @IsNotEmpty()
  poaUrl!: string;

  @IsNumber()
  @Min(0)
  escrowAmount!: number;

  @IsString()
  @IsNotEmpty()
  stripeIntentId!: string;
}