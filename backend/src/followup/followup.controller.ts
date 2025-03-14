import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { FollowUpService } from './followup.service';
import { CreateFollowUpDto } from './dto/create-followup.dto';
import { UpdateFollowUpDto } from './dto/update-followup.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Follow-Ups')
@Controller('followups')
export class FollowUpController {
    constructor(private followUpService: FollowUpService) {}

    @Get()
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({ summary: 'Get all follow-ups' })
    async getAllFollowUps() {
        return this.followUpService.getAllFollowUps();
    }

    @Get(':id')
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({ summary: 'Get follow-up by ID' })
    async getFollowUpById(@Param('id') id: string) {
        return this.followUpService.getFollowUpById(id);
    }

    @Post()
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({ summary: 'Create a new follow-up' })
    async createFollowUp(@Body() body: CreateFollowUpDto) {
        return this.followUpService.createFollowUp(body);
    }

    @Put(':id')
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({ summary: 'Update a follow-up' })
    async updateFollowUp(@Param('id') id: string, @Body() body: UpdateFollowUpDto) {
        return this.followUpService.updateFollowUp(id, body);
    }

    @Delete(':id')
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({ summary: 'Delete a follow-up' })
    async deleteFollowUp(@Param('id') id: string) {
        return this.followUpService.deleteFollowUp(id);
    }
}
