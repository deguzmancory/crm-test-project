import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Subscriptions')
@Controller('subscriptions')
export class SubscriptionController {
    constructor(private subscriptionService: SubscriptionService) {}

    @Get()
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({ summary: 'Get all subscriptions' })
    async getAllSubscriptions() {
        return this.subscriptionService.getAllSubscriptions();
    }

    @Get(':id')
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({ summary: 'Get subscription by ID' })
    async getSubscriptionById(@Param('id') id: string) {
        return this.subscriptionService.getSubscriptionById(id);
    }

    @Post()
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({ summary: 'Create a new subscription' })
    async createSubscription(@Body() body: CreateSubscriptionDto) {
        return this.subscriptionService.createSubscription(body);
    }

    @Put(':id')
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({ summary: 'Update a subscription' })
    async updateSubscription(@Param('id') id: string, @Body() body: UpdateSubscriptionDto) {
        return this.subscriptionService.updateSubscription(id, body);
    }

    @Delete(':id')
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({ summary: 'Delete a subscription' })
    async deleteSubscription(@Param('id') id: string) {
        return this.subscriptionService.deleteSubscription(id);
    }
}
