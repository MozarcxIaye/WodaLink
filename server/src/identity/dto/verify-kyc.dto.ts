import { IsString, IsUrl } from "class-validator";


export class VerifyKycDto{

    @IsString()
    documentType!: string

    @IsUrl()
    documentUrl!: string
}
