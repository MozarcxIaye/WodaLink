import { IsEmail, IsEnum, IsNotEmpty, IsString, MinLength, ValidateIf } from "class-validator";

import { UserRole } from "../entities/user-role.enum";


export class RegisterUserDto {

    @IsEmail()
    email!: string

    @MinLength(8)
    password!: string

    @IsString()
    @IsNotEmpty()
    name!: string

    @IsEnum(UserRole)
    role!: UserRole

    @ValidateIf((o) => o.role === UserRole.RUNNER)
    @IsString()
    municipalityId!: string
}