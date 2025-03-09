import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getAllUsers() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        role: true,
      },
    });
  }

  async createUser(
    email: string,
    password: string,
    role: 'USER' | 'ADMIN' | 'MANAGER',
  ) {
    try {
      // Check if user exists
      const existingUser = await this.prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        throw new BadRequestException('Email is already in use.')
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      const user = await this.prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          role,
        },
      });

      return {
        success: true,
        message: 'User created successfully.',
        data: {
          id: user.id,
          email: user.email,
          role: user.role,
        }
      };
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new BadRequestException('Failed to create user.');
    }
  }

  async deleteUser(id: string) {
    // Check if the user exists before attempting deletion
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found.')
    }

    // Delete user if found
    await this.prisma.user.delete({
      where: { id },
    });

    return {
      success: true,
      message: `User deleted successfully.`
    }
  }

  async verifyUser(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException('User not found.');
    }

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
        email: user.email,
        role: user.role,
      },
    };
  }
}
