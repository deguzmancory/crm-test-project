import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { RoleType } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  private generateTokens(userId: string, email: string, roles: RoleType[]) {
    const payload = { id: userId, email, roles };

    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '1h',
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.REFRESH_SECRET,
      expiresIn: '7d',
    });

    return { accessToken, refreshToken };
  }

  async registerUser(dto: CreateUserDto) {
    const existingUser = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existingUser) throw new BadRequestException('Email already in use.');

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

    await this.prisma.userRole.createMany({
      data: (dto.roles || [RoleType.SALES_REP]).map(role => ({
        userId: newUser.id,
        role,
      })),
    });

    const assignedRoles = await this.prisma.userRole.findMany({
      where: { userId: newUser.id },
      select: { role: true },
    });

    return this.generateTokens(newUser.id, newUser.email, assignedRoles.map(r => r.role));
  }

  async loginUser(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: { roles: true },
    });

    if (!user) throw new NotFoundException('User not found.');

    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) throw new BadRequestException('Invalid credentials.');

    return this.generateTokens(user.id, user.email, user.roles.map(r => r.role));
  }

  async refreshUserToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, { secret: process.env.REFRESH_SECRET });

      const user = await this.prisma.user.findUnique({
        where: { id: payload.id },
        include: { roles: true },
      });

      if (!user) throw new NotFoundException('User not found.');

      return this.generateTokens(user.id, user.email, user.roles.map(r => r.role));
    } catch (error) {
      throw new BadRequestException('Invalid or expired refresh token.');
    }
  }
}
