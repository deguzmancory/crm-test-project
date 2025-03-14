import {
  Controller,
  Get,
  Post,
  Delete,
  Put,
  Param,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { AuthRequest } from 'src/auth/auth-request.interface';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles/roles.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  // Admin route
  @Get('admin')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  getAdminPanel() {
    return { message: 'Welcome, Admin' };
  }

  // Get all users
  @Get()
  @UseGuards(AuthGuard('jwt'))
  async getUsers() {
    return this.userService.getAllUsers();
  }

  // Get user by ID
  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Get current user profile' })
  async getProfile(@Req() req: AuthRequest) {
    return this.userService.getUserById(req.user.id);
  }

  // Update user by ID
  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Update a user by ID' })
  async updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.updateUser(id, updateUserDto);
  }

  @Get(':id/roles')
  @UseGuards(AuthGuard('jwt'))
  async getUserRoles(@Param('id') id: string) {
    const roles = await this.userService.getUserRoles(id);
    return {id, roles};
  }

  // Create a new user
  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  async createUser(@Body() body: CreateUserDto) {
    return this.userService.createUser(body);
  }

  // Login user
  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    return this.userService.verifyUser(body.email, body.password);
  }

  // Delete user
  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async deleteUser(@Req() req: AuthRequest, @Param('id') id: string) {
    return this.userService.deleteUser(req.user.id, id);
  }
}
