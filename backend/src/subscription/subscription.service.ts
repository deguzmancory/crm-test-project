import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { SubscriptionPlan, SubscriptionStatus } from '@prisma/client';

@Injectable()
export class SubscriptionService {
    constructor(private prisma: PrismaService) {}

    async getAllSubscriptions() {
        return this.prisma.subscription.findMany({
            select: {
                id: true,
                userId: true,
                plan: true,
                status: true,
                startDate: true,
                endDate: true,
            },
        });
    }

    async getSubscriptionById(id: string) {
        const subscription = await this.prisma.subscription.findUnique({
            where: { id },
            select: {
                id: true,
                userId: true,
                plan: true,
                status: true,
                startDate: true,
                endDate: true,
            },
        });

        if (!subscription) throw new NotFoundException('Subscription not found.');
        return subscription;
    }

    async createSubscription(dto: CreateSubscriptionDto) {
        // Check if the user already has an active subscription
        const existingSubscription = await this.prisma.subscription.findFirst({
            where: { userId: dto.userId, status: SubscriptionStatus.ACTIVE },
        });

        if (existingSubscription) {
            throw new BadRequestException('User already has an active subscription.');
        }

        return this.prisma.subscription.create({
            data: {
                userId: dto.userId,
                plan: dto.plan,
                status: dto.status ?? SubscriptionStatus.ACTIVE, // Defaults to ACTIVE if not provided
                startDate: new Date(),
                endDate: new Date(dto.endDate),
            },
        });
    }

    async updateSubscription(id: string, dto: UpdateSubscriptionDto) {
        const subscription = await this.prisma.subscription.findUnique({
            where: { id },
        });

        if (!subscription) throw new NotFoundException('Subscription not found.');

        return this.prisma.subscription.update({
            where: { id },
            data: {
                ...dto,
            },
        });
    }

    async deleteSubscription(id: string) {
        const subscription = await this.prisma.subscription.findUnique({
            where: { id },
        });

        if (!subscription) throw new NotFoundException('Subscription not found.');

        await this.prisma.subscription.delete({
            where: { id },
        });

        return { success: true, message: 'Subscription deleted successfully.' };
    }
}
