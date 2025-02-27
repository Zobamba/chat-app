import { Controller, Post, Get, Body, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthRequest, JwtAuthGuard } from 'src/common/guards/jwt.guard';
import { JwtPayload } from 'src/common/guards/ws-auth.types';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: { username: string; password: string }) {
    return this.authService.login(loginDto.username, loginDto.password);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getCurrentUser(@Req() req: AuthRequest): JwtPayload | null {
    return req.user ?? null;
  }
}
