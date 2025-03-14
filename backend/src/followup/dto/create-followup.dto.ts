import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';
import { FollowUpStatus } from '@prisma/client';

export class CreateFollowUpDto {
    @ApiProperty({ description: 'Associated Account ID (must be a valid UUID)' })
    @IsUUID()
    @IsNotEmpty()
    accountId: string;

    @ApiProperty({ description: 'Sales Representative ID (must be a valid UUID)' })
    @IsUUID()
    @IsOptional() // Sales rep is optional
    salesRepId?: string;

    @ApiProperty({ 
        example: FollowUpStatus.PENDING, 
        description: 'Follow-up status (PENDING, COMPLETED, OVERDUE)', 
        enum: FollowUpStatus 
    })
    @IsEnum(FollowUpStatus)
    @IsOptional() // Defaults to PENDING in Prisma if not provided
    status?: FollowUpStatus;
}
