import { IsMongoId, IsNotEmpty } from 'class-validator';

export class AssignRunnerDto {
  @IsMongoId()
  @IsNotEmpty()
  runnerId!: string;
}