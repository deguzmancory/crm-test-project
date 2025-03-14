import { Controller, Post, Body, Res, Req, UnauthorizedException } from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { ApiOperation, ApiResponse, ApiBody, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from './dto/create-user.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  @ApiOperation({ summary: 'User Signup' })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  @ApiResponse({ status: 400, description: 'User already exists' })
  @ApiBody({ type: CreateUserDto })
  async signup(@Body() createUserDto: CreateUserDto) {
    return this.authService.registerUser(createUserDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'User Login' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 400, description: 'Invalid credentials' })
  @ApiBody({ type: LoginDto })
  async login(@Body() body: LoginDto, @Res() res: Response) {
    const { accessToken, refreshToken } = await this.authService.loginUser(body.email, body.password);

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    return res.json({ accessToken });
  }

  @Post('refresh-token')
  @ApiOperation({ summary: 'Refresh Access Token' })
  @ApiResponse({ status: 200, description: 'New access token generated' })
  @ApiResponse({ status: 400, description: 'Invalid or expired refresh token' })
  async refreshToken(@Req() req: Request, @Res() res: Response) {
    const refreshToken = req.cookies['refresh_token'];
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token missing');
    }

    const { accessToken, refreshToken: newRefreshToken } = await this.authService.refreshUserToken(refreshToken);

    res.cookie('refresh_token', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    return res.json({ accessToken });
  }

  @Post('logout')
  @ApiOperation({ summary: 'Logout' })
  async logout(@Res() res: Response) {
    res.clearCookie('refresh_token');
    return res.json({ message: 'Logged out successfully' });
  }
}
