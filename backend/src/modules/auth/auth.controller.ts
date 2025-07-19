import { Controller, Post, Body, Res, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './dto';
import { Response, Request } from 'express';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto, @Res() res: Response) {
    // lógica de registro
    return res.json({ message: 'Registro exitoso' });
  }

  @Post('login')
  async login(@Body() dto: LoginDto, @Res() res: Response) {
    // lógica de login
    return res.json({ message: 'Login exitoso' });
  }

  @Post('refresh')
  @UseGuards(JwtAuthGuard)
  async refresh(@Req() req: Request, @Res() res: Response) {
    // lógica de refresh
    return res.json({ message: 'Token refrescado' });
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Req() req: Request, @Res() res: Response) {
    // lógica de logout
    return res.json({ message: 'Logout exitoso' });
  }
} 