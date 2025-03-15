import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update.contact.dto';

@Injectable()
export class ContactService {
    constructor(private prisma: PrismaService) {}

    // Get all contacts
    async getAllContacts() {
        return this.prisma.contact.findMany({
            include: {
                account: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });
    }

    // Get contact by ID
    async getContactById(id: string) {
        const contact = await this.prisma.contact.findUnique({
            where: { id },
            include: {
                account: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });

        if (!contact) throw new NotFoundException('Contact not found.');

        return contact;
    }

    // Create a new contact
    async createContact(dto: CreateContactDto) {
        const existingContact = await this.prisma.contact.findUnique({
            where: { email: dto.email },
        });

        if (existingContact) throw new BadRequestException('A contact with this email already exists.');

        return this.prisma.contact.create({
            data: {
                accountId: dto.accountId,
                firstName: dto.firstName,
                lastName: dto.lastName,
                email: dto.email,
                phone: dto.phone,
            },
        });
    }

    // Update contact
    async updateContact(id: string, dto: UpdateContactDto) {
        const contact = await this.prisma.contact.findUnique({
            where: { id },
        });

        if (!contact) throw new NotFoundException('Contact not found.');

        return this.prisma.contact.update({
            where: { id },
            data: {
                firstName: dto.firstName,
                lastName: dto.lastName,
                email: dto.email,
                phone: dto.phone,
            },
        });
    }

    // Delete contact
    async deleteContact(id: string) {
        const contact = await this.prisma.contact.findUnique({
            where: { id },
        });

        if (!contact) throw new NotFoundException('Contact not found.');

        await this.prisma.contact.delete({
            where: { id },
        });

        return { success: true, message: 'Contact deleted successfully.' };
    }
}
