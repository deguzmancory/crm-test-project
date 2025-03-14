import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from '../auth/dto/create-user.dto';
import { UserRole } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  // Get all users
  async getAllUsers() {
    const users = await this.prisma.user.findMany({
        select: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            email: true,
            roles: {
                select: { role: true },
            },
        },
    });

    return users.map(user => ({
        ...user,
        roles: user.roles.map(r => r.role), 
    }));
}

  // Get user by ID
  async getUserById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        roles: {
          select: { role: true },
        }
      },
    });

    if (!user) throw new NotFoundException('User not found.');

    return {
      ...user,
      roles: user.roles.map(r => r.role), 
    };
}


  // Get user roles
  async getUserRoles(userId: string) {
    const roles = await this.prisma.userRole.findMany({
      where: { userId },
      select: { role: true },
    });

    return roles.map(role => role.role);
  }

  // Create a new user
  async createUser(dto: CreateUserDto) {
    const existingUser = await this.prisma.user.findUnique({
        where: { email: dto.email },
    });

    if (existingUser) throw new BadRequestException('Email is already in use.');

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const newUser = await this.prisma.user.create({
        data: {
            email: dto.email,
            username: dto.username,
            firstName: dto.firstName,
            lastName: dto.lastName,
            password: hashedPassword,
        },
    });

    // Assign roles to the user (default role: SALES_REP)
    await this.prisma.userRole.createMany({
        data: (dto.roles || ['SALES_REP']).map(role => ({
            userId: newUser.id,
            role,
        })),
    });

    // Fetch assigned roles and return them in response
    const assignedRoles = await this.prisma.userRole.findMany({
      where: { userId: newUser.id },
      select: { role: true },
    });

    return {
      ...newUser,
      roles: assignedRoles.map(r => r.role), 
    };
}

// Update an existing user
async updateUser(id: string, updateUserDto: Partial<CreateUserDto>) {
  const existingUser = await this.prisma.user.findUnique({
      where: { id },
      include: { roles: true },
  });

  if (!existingUser) throw new NotFoundException('User not found.');

  // If updating password, hash it
  let updatedData: any = { ...updateUserDto };
  if (updateUserDto.password) {
      updatedData.password = await bcrypt.hash(updateUserDto.password, 10);
  }

  // Update user details
  const updatedUser = await this.prisma.user.update({
      where: { id },
      data: updatedData,
  });

  // If roles are being updated
  if (updateUserDto.roles) {
      // Remove existing roles
      await this.prisma.userRole.deleteMany({
          where: { userId: id },
      });

      // Assign new roles
      await this.prisma.userRole.createMany({
          data: updateUserDto.roles.map(role => ({
              userId: id,
              role,
          })),
      });
  }

  // Fetch updated roles
  const updatedRoles = await this.prisma.userRole.findMany({
      where: { userId: id },
      select: { role: true },
  });

  return {
      ...updatedUser,
      roles: updatedRoles.map(r => r.role),
  };
}


// Delete a user
async deleteUser(requestingUserId: string, userIdToDelete: string) {
  const requestingUser = await this.prisma.user.findUnique({
      where: { id: requestingUserId },
      include: { roles: true },
  });

  if (!requestingUser) throw new NotFoundException('Requesting user not found.');

  // Check if the requesting user is an ADMIN
  const isAdmin = requestingUser.roles.some(role => role.role === 'ADMIN');
  if (!isAdmin && requestingUserId !== userIdToDelete) {
      throw new BadRequestException('You do not have permission to delete this user.');
  }

  const userToDelete = await this.prisma.user.findUnique({
      where: { id: userIdToDelete },
  });

  if (!userToDelete) throw new NotFoundException('User not found.');

  // Delete user roles first
  await this.prisma.userRole.deleteMany({
      where: { userId: userIdToDelete },
  });

  // Delete user
  await this.prisma.user.delete({
      where: { id: userIdToDelete },
  });

  return { success: true, message: 'User and roles deleted successfully.' };
}

  // Verify user credentials
  async verifyUser(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: { roles: true },
    });

    if (!user) throw new NotFoundException('User not found.');

    // Validate password
    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
      throw new BadRequestException('Invalid credentials.');
    }

    return {
      success: true,
      message: 'Login Successful',
      data: {
        id: user.id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        roles: user.roles.map(r => r.role), 
      },
    };
  }
}
