import { Injectable } from '@nestjs/common';
import { RegisterDto, LoginDto } from './dto';

@Injectable()
export class AuthService {
  async register(dto: RegisterDto) {
    // lógica de registro
  }
  async login(dto: LoginDto) {
    // lógica de login
  }
  async refresh(token: string) {
    // lógica de refresh
  }
  async logout(token: string) {
    // lógica de logout
  }
} 