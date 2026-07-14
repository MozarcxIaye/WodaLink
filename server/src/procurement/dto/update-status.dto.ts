import { ApiProperty } from '@nestjs/swagger';
import { RequestStatus } from "../entities/request-status.enum";

export class UpdateStatusDto {

    @ApiProperty({ enum: RequestStatus, description: 'Request status to update' })
    status!: RequestStatus;

}