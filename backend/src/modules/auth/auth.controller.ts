import { Controller, Post, Body, Res, Req, UseGuards } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './dto';
import { Response, Request } from 'express';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto, @Res() res: Response) {
    const result = await this.authService.register(dto);
    return res.json(result);
  }

  @Post('login')
  @Throttle(5) // 5 intentos por minuto
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('refresh')
  @UseGuards(JwtAuthGuard)
  async refresh(@Req() req: Request, @Res() res: Response) {
    const oldToken = req.cookies['jwt'];
    const result = await this.authService.refresh(oldToken);
    res.cookie('jwt', result.token, {
      httpOnly: true,
      secure: process.env.APP_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 1000,
    });
    return res.json({ message: 'Token refrescado' });
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Req() req: Request, @Res() res: Response) {
    res.clearCookie('jwt');
    await this.authService.logout('');
    return res.json({ message: 'Logout exitoso' });
  }
} 