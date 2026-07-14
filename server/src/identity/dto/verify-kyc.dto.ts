import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUrl } from "class-validator";


export class VerifyKycDto {

    @ApiProperty({ example: 'passport', description: 'Type of KYC document being submitted' })
    @IsString()
    documentType!: string

    @ApiProperty({ example: 'https://example.com/document.pdf', description: 'URL to the KYC document' })
    @IsUrl()
    documentUrl!: string
}
