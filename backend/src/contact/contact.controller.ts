import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update.contact.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Contacts')
@Controller('contacts')
export class ContactController {
    constructor(private contactService: ContactService) {}

    @Get()
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({ summary: 'Get all contacts' })
    async getAllContacts() {
        return this.contactService.getAllContacts();
    }

    @Get(':id')
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({ summary: 'Get contact by ID' })
    async getContactById(@Param('id') id: string) {
        return this.contactService.getContactById(id);
    }

    @Post()
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({ summary: 'Create a new contact' })
    async createContact(@Body() body: CreateContactDto) {
        return this.contactService.createContact(body);
    }

    @Put(':id')
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({ summary: 'Update a contact' })
    async updateContact(@Param('id') id: string, @Body() body: UpdateContactDto) {
        return this.contactService.updateContact(id, body);
    }

    @Delete(':id')
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({ summary: 'Delete a contact' })
    async deleteContact(@Param('id') id: string) {
        return this.contactService.deleteContact(id);
    }
}
