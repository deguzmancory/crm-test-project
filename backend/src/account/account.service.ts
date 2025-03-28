import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';

@Injectable()
export class AccountService {
    constructor(private prisma: PrismaService) {}

    async getAllAccounts() {
        return this.prisma.account.findMany({
            select: {
                id: true,
                name: true,
                industry: true,
                category: true,
                salesRepId: true,
                contact: {  
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                    },
                },
            },
        });
    }
    
    async getAccountById(id: string) {
        const account = await this.prisma.account.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                industry: true,
                category: true,
                salesRepId: true,
                contact: { 
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                    },
                },
            },
        });
    
        if (!account) throw new NotFoundException('Account not found.');
        return account;
    }

    async getContactsByAccount(accountId: string) {
        return this.prisma.contact.findMany({
            where: { accountId },
        });
    }    
    

    async createAccount(dto: CreateAccountDto) {
        const existingAccount = await this.prisma.account.findFirst({
            where: { name: dto.name },
        });
    
        if (existingAccount) throw new BadRequestException('Account name is already in use.');
    
        return this.prisma.account.create({
            data: {
                name: dto.name,
                industry: dto.industry,
                category: dto.category ?? 'C',
                salesRepId: dto.salesRepId,
            },
        });
    }
    
    async updateAccount(id: string, dto: UpdateAccountDto) {
        const account = await this.prisma.account.findUnique({
            where: { id },
        });
    
        if (!account) throw new NotFoundException('Account not found.');
    
        return this.prisma.account.update({
            where: { id },
            data: {
                name: dto.name,
                industry: dto.industry,
                category: dto.category,
                salesRepId: dto.salesRepId,
            },
        });
    }
       

    async deleteAccount(id: string) {
        const account = await this.prisma.account.findUnique({
            where: { id },
        });
    
        if (!account) throw new NotFoundException('Account not found.');
    
        // Delete related follow-ups
        await this.prisma.followUp.deleteMany({
            where: { accountId: id },
        });
    
        // Delete account
        await this.prisma.account.delete({
            where: { id },
        });
    
        return { success: true, message: 'Account and related follow-ups deleted successfully.' };
    }
    
}
