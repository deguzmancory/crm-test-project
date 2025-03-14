import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsOptional, IsUUID } from "class-validator";

export class CreateContactDto {
    @ApiProperty({ example: 'John', description: 'Contact first name' })
    @IsNotEmpty()
    firstName: string;

    @ApiProperty({ example: 'Doe', description: 'Contact last name' })
    @IsNotEmpty()
    lastName: string;

    @ApiProperty({ example: 'test@example.com', description: 'User email address' })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({ example: '555-555-5555', description: 'Contact phone number' })
    @IsOptional()
    phone?: string;

    @ApiProperty({ example: 'uuid-of-account', description: 'Account ID' })
    @IsUUID()
    @IsNotEmpty()
    accountId: string;
}