import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsOptional, IsUUID } from "class-validator";

export enum AccountCategory {
    A = 'A',
    B = 'B',
    C = 'C',
    D = 'D',
}

export class CreateAccountDto {
    @ApiProperty({ example: 'Example Account', description: 'Account name' })
    @IsNotEmpty()
    name: string;

    @ApiProperty({ example: 'Example Industry', description: 'Account industry' })
    @IsOptional()
    industry?: string;

    @ApiProperty({ description: 'Contact ID' })
    @IsUUID()
    contactId: string;

    @ApiProperty({ description: 'Sales Rep ID' })
    @IsUUID()
    salesRepId: string;

    @ApiProperty({ 
        example: AccountCategory.C, 
        description: 'Account category (A, B, C, D)', 
        enum: AccountCategory 
    })
    @IsEnum(AccountCategory)  
    @IsOptional()  
    category?: AccountCategory;
}
