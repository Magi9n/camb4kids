import { Controller, Post, Body, HttpException, HttpStatus, UseGuards, Get, Request, Put } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto, VerifyEmailDto, CompleteProfileDto, ForgotPasswordDto, ResetPasswordDto, UpdateProfileDto, ChangeEmailDto, VerifyNewEmailDto } from './dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  async register(@Body() registerDto: RegisterDto) {
    try {
      return await this.authService.register(registerDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('verify-email')
  async verifyEmail(@Body() verifyEmailDto: VerifyEmailDto) {
    try {
      return await this.authService.verifyEmail(verifyEmailDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('complete-profile')
  async completeProfile(@Body() completeProfileDto: CompleteProfileDto) {
    try {
      return await this.authService.completeProfile(completeProfileDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('login')
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  async login(@Body() loginDto: LoginDto) {
    try {
      return await this.authService.login(loginDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('forgot-password')
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    try {
      return await this.authService.forgotPassword(forgotPasswordDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('reset-password')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    try {
      return await this.authService.resetPassword(resetPasswordDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('verify')
  @UseGuards(JwtAuthGuard)
  async verify(@Request() req) {
    return { valid: true, user: req.user };
  }

  @Get('profile-status')
  @UseGuards(JwtAuthGuard)
  async getProfileStatus(@Request() req) {
    return this.authService.getProfileStatus(req.user);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Request() req) {
    return this.authService.getProfile(req.user);
  }

  @Put('profile')
  @UseGuards(JwtAuthGuard)
  async updateProfile(@Body() updateProfileDto: UpdateProfileDto, @Request() req) {
    try {
      return await this.authService.updateProfile(updateProfileDto, req.user);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('change-email')
  @UseGuards(JwtAuthGuard)
  async changeEmail(@Body() changeEmailDto: ChangeEmailDto, @Request() req) {
    try {
      return await this.authService.changeEmail(changeEmailDto, req.user);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('verify-new-email')
  @UseGuards(JwtAuthGuard)
  async verifyNewEmail(@Body() verifyNewEmailDto: VerifyNewEmailDto, @Request() req) {
    try {
      return await this.authService.verifyNewEmail(verifyNewEmailDto, req.user);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
} 