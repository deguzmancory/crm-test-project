import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFollowUpDto } from './dto/create-followup.dto';
import { UpdateFollowUpDto } from './dto/update-followup.dto';
import { FollowUpStatus, AccountCategory } from '@prisma/client';
import { addDays } from 'date-fns';

@Injectable()
export class FollowUpService {
  constructor(private prisma: PrismaService) {}

  async getAllFollowUps() {
    return this.prisma.followUp.findMany({
      select: {
        id: true,
        accountId: true,
        salesRepId: true,
        followUpDate: true,
        status: true,
      },
    });
  }

  async getFollowUpById(id: string) {
    const followUp = await this.prisma.followUp.findUnique({
      where: { id },
      select: {
        id: true,
        accountId: true,
        salesRepId: true,
        followUpDate: true,
        status: true,
      },
    });

    if (!followUp) throw new NotFoundException('Follow-up not found.');
    return followUp;
  }

  async createFollowUp(dto: CreateFollowUpDto) {
    const account = await this.prisma.account.findUnique({
      where: { id: dto.accountId },
      select: { category: true }, 
    });

    if (!account) throw new NotFoundException('Account not found.');

    const followUpDelay = this.getFollowUpDelay(account.category);
    const followUpDate = addDays(new Date(), followUpDelay);

    return this.prisma.followUp.create({
      data: {
        accountId: dto.accountId,
        salesRepId: dto.salesRepId ?? null, // Nullable in schema
        followUpDate,
        status: dto.status ?? FollowUpStatus.PENDING,
      },
    });
  }

  async updateFollowUp(id: string, dto: UpdateFollowUpDto) {
    const followUp = await this.prisma.followUp.findUnique({
      where: { id },
    });

    if (!followUp) throw new NotFoundException('Follow-up not found.');

    return this.prisma.followUp.update({
      where: { id },
      data: {
        ...dto,
      },
    });
  }

  async deleteFollowUp(id: string) {
    const followUp = await this.prisma.followUp.findUnique({
      where: { id },
    });

    if (!followUp) throw new NotFoundException('Follow-up not found.');

    await this.prisma.followUp.delete({
      where: { id },
    });

    return { success: true, message: 'Follow-up deleted successfully.' };
  }

  private getFollowUpDelay(category: AccountCategory): number {
    switch (category) {
      case AccountCategory.A: return 2;
      case AccountCategory.B: return 3;
      case AccountCategory.C: return 4;
      case AccountCategory.D: return 5;
      default: return 4;
    }
  }
}
