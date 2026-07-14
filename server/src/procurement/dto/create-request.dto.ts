import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsString, IsUrl, Min } from 'class-validator';
import { DocumentType } from '../entities/request-status.enum';

export class CreateRequestDto {
  @ApiProperty({ example: 'Ward-12', description: 'Ward code for the document request' })
  @IsString()
  @IsNotEmpty()
  wardCode!: string;

  @ApiProperty({ enum: DocumentType, description: 'Document type requested' })
  @IsEnum(DocumentType)
  documentType!: DocumentType;

  @ApiProperty({ example: 'https://example.com/poa.pdf', description: 'Proof of address URL' })
  @IsUrl()
  @IsNotEmpty()
  poaUrl!: string;

  @ApiProperty({ example: 250.75, minimum: 0, description: 'Escrow amount for the request' })
  @IsNumber()
  @Min(0)
  escrowAmount!: number;

}