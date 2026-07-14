import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty } from 'class-validator';

export class AssignRunnerDto {
  @ApiProperty({ example: '650a7d2e1a2d4f4d6c9ece63', description: 'Runner id to assign to the request' })
  @IsMongoId()
  @IsNotEmpty()
  runnerId!: string;
}