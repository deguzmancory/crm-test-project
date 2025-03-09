import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation, ApiResponse, ApiTags, ApiBody } from '@nestjs/swagger';
import { SignupDto } from './dto/signup.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('signup')
    @ApiOperation({ summary: 'User Signup' })
    @ApiResponse({ status: 201, description: 'User created successfully' })
    @ApiBody({ type: SignupDto })
    async signup(@Body() body: { email: string, password: string }) {
        return this.authService.signup(body.email, body.password);
    }

    @Post('login')
    async login(@Body() body: { email: string; password: string }) {
        const user = await this.authService.validateUser(body.email, body.password);
        const tokens = await this.authService.login(user);

        return tokens;
    }

    @Post('refresh-token')
    async refreshToken(@Body() body: { refresh_token: string }) {
        return this.authService.refreshToken(body.refresh_token);
    }
}
