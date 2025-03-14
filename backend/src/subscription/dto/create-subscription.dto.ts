import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsUUID, IsOptional, IsISO8601 } from 'class-validator';
import { SubscriptionPlan, SubscriptionStatus } from '@prisma/client';

export class CreateSubscriptionDto {
    @ApiProperty({ description: 'User ID (must be a valid UUID)' })
    @IsUUID()
    @IsNotEmpty()
    userId: string;

    @ApiProperty({ 
        example: SubscriptionPlan.BASIC, 
        description: 'Subscription plan type (BASIC or PREMIUM)', 
        enum: SubscriptionPlan 
    })
    @IsEnum(SubscriptionPlan)
    @IsNotEmpty()
    plan: SubscriptionPlan;

    @ApiProperty({ 
        example: SubscriptionStatus.ACTIVE, 
        description: 'Subscription status (ACTIVE, EXPIRED, CANCELLED)', 
        enum: SubscriptionStatus 
    })
    @IsEnum(SubscriptionStatus)
    @IsOptional() // Defaults to ACTIVE in Prisma
    status?: SubscriptionStatus;

    @ApiProperty({ description: 'Subscription end date (YYYY-MM-DD format)' })
    @IsISO8601()
    @IsNotEmpty()
    endDate: string;
}
