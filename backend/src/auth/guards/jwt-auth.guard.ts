import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '../auth.service';
import { Request, Response } from 'express';
import { Reflector } from '@nestjs/core';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private authService: AuthService, private reflector: Reflector) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();

    try {
      return (await super.canActivate(context)) as boolean;
    } catch (err) {
      console.log('Access token expired, attempting refresh...');

      const refreshToken = request.cookies['refresh_token'];

      if (!refreshToken) {
        throw new UnauthorizedException('Refresh token missing');
      }

      try {
        const { accessToken, refreshToken: newRefreshToken } = await this.authService.refreshUserToken(refreshToken);

        response.cookie('refresh_token', newRefreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
        });

        request.headers['authorization'] = `Bearer ${accessToken}`;

        return true;
      } catch (refreshError) {
        console.log('Refresh token expired, forcing logout');
        throw new UnauthorizedException('Session expired, please log in again.');
      }
    }
  }
}
