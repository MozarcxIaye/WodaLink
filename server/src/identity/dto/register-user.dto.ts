import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsString, MinLength, ValidateIf } from "class-validator";

import { UserRole } from "../entities/user-role.enum";


export class RegisterUserDto {

    @ApiProperty({ example: 'runner@example.com', description: 'User email address' })
    @IsEmail()
    email!: string

    @ApiProperty({ minLength: 8, description: 'Password for the account' })
    @MinLength(8)
    password!: string

    @ApiProperty({ example: 'John Doe', description: 'Full name of the user' })
    @IsString()
    @IsNotEmpty()
    name!: string

    @ApiProperty({ enum: UserRole, description: 'Selected role for the new user' })
    @IsEnum(UserRole)
    role!: UserRole

    @ApiProperty({ required: false, description: 'Runner municipality ID, mandatory when role is runner' })
    @ValidateIf((o) => o.role === UserRole.RUNNER)
    @IsString()
    municipalityId!: string
}