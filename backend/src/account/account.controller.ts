import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { AccountService } from './account.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/roles.decorator';

@ApiTags('Accounts')
@Controller('accounts')
export class AccountController {
    constructor(private accountService: AccountService) {}

    @Get()
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({ summary: 'Get all accounts' })
    async getAllAccounts() {
        return this.accountService.getAllAccounts();
    }

    @Get(':id')
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({ summary: 'Get account by ID' })
    async getAccountById(@Param('id') id: string) {
        return this.accountService.getAccountById(id);
    }

    @Post()
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('ADMIN')
    @ApiOperation({ summary: 'Create a new account' })
    async createAccount(@Body() body: CreateAccountDto) {
        return this.accountService.createAccount(body);
    }

    @Put(':id')
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({ summary: 'Update an account' })
    async updateAccount(@Param('id') id: string, @Body() body: UpdateAccountDto) {
        return this.accountService.updateAccount(id, body);
    }

    @Delete(':id')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('ADMIN')
    @ApiOperation({ summary: 'Delete an account' })
    async deleteAccount(@Param('id') id: string) {
        return this.accountService.deleteAccount(id);
    }
}
