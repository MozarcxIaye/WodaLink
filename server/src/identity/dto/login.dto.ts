
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, MinLength } from "class-validator";

export class LoginDto {
    @ApiProperty({ example: 'user@example.com', description: 'Registered user email' })
    @IsEmail()
    email!: string;

    @ApiProperty({ minLength: 8, description: 'Password for login' })
    @MinLength(8)
    password!: string;

}