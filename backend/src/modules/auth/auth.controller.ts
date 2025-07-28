import { Controller, Post, Body, HttpException, HttpStatus, UseGuards, Get, Request } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto, VerifyEmailDto, CompleteProfileDto, ForgotPasswordDto, ResetPasswordDto } from './dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    try {
      const result = await this.authService.register(dto);
      return result;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('verify-email')
  async verifyEmail(@Body() dto: VerifyEmailDto) {
    try {
      const result = await this.authService.verifyEmail(dto);
      return result;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('complete-profile')
  async completeProfile(@Body() dto: CompleteProfileDto) {
    try {
      const result = await this.authService.completeProfile(dto);
      return result;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('login')
  @Throttle({ default: { limit: 5, ttl: 60000 } }) // 5 intentos por minuto
  async login(@Body() dto: LoginDto) {
    try {
      const result = await this.authService.login(dto);
      return result;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.UNAUTHORIZED);
    }
  }

  @Post('forgot-password')
  @Throttle({ default: { limit: 3, ttl: 300000 } }) // 3 intentos por 5 minutos
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    try {
      await this.authService.forgotPassword(dto);
      return { message: 'Se ha enviado un correo con las instrucciones para restablecer tu contraseña.' };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('reset-password')
  async resetPassword(@Body() dto: ResetPasswordDto) {
    try {
      await this.authService.resetPassword(dto);
      return { message: 'Contraseña actualizada exitosamente.' };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('verify-reset-token')
  async verifyResetToken(@Body() body: { token: string }) {
    try {
      const isValid = await this.authService.verifyResetToken(body.token);
      return { valid: isValid };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('verify')
  @UseGuards(JwtAuthGuard)
  async verifyToken(@Request() req) {
    try {
      // Si llegamos aquí, el token es válido (el guard lo verificó)
      return { 
        valid: true, 
        user: {
          id: req.user.id,
          email: req.user.email,
          name: req.user.name,
          lastname: req.user.lastname,
          role: req.user.role
        }
      };
    } catch (error) {
      throw new HttpException('Token inválido', HttpStatus.UNAUTHORIZED);
    }
  }
} 