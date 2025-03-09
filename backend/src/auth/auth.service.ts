import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { Role } from '@prisma/client';
import { CreateUserDto } from 'src/user/dto/user.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }

  async signup(createUserDto: CreateUserDto) {
    const { email, username, firstName, lastName, password, role } = createUserDto;

    const userExists = await this.prisma.user.findUnique({ where: { email } });
    if (userExists) {
      throw new UnauthorizedException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    return await this.prisma.user.create({
      data: {
        email,
        username,
        firstName,
        lastName,
        password: hashedPassword,
        role: role || Role.USER, 
      },
    });
  }

  async login(user: { id: string; email: string; role: string }) {
    const payload = { sub: user.id, email: user.email, role: user.role };

    const access_token = this.jwtService.sign(payload, { expiresIn: '15m' });
    const refresh_token = this.jwtService.sign(payload, { expiresIn: '7d' });

    return { access_token, refresh_token };
}


  async refreshToken(refresh_token: string) {
    try {
      const payload = this.jwtService.verify(refresh_token);
      const user = await this.prisma.user.findUnique({ where: { id: payload.sub } });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      return this.login(user); 
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
