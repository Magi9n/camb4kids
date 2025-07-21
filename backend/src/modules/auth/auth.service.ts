import { Injectable, UnauthorizedException, ConflictException, BadRequestException, NotFoundException } from '@nestjs/common';
import { RegisterDto, LoginDto, VerifyEmailDto, CompleteProfileDto } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

function generateCode() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

async function sendVerificationEmail(email: string, code: string) {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: email,
      subject: 'Código de verificación',
      text: `Tu código de verificación es: ${code}\nEste código es válido por 30 minutos.`,
    });
    console.log(`[EMAIL] Correo de verificación enviado a: ${email}`);
  } catch (err) {
    console.error('[EMAIL] Error al enviar correo de verificación:', err);
  }
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async register(dto: RegisterDto) {
    const exists = await this.userRepo.findOne({ where: { email: dto.email } });
    if (exists) throw new ConflictException('El correo ya está registrado');
    const hash = await bcrypt.hash(dto.password, 10);
    const code = generateCode();
    const expires = new Date(Date.now() + 30 * 60 * 1000); // 30 minutos
    const user = this.userRepo.create({
      email: dto.email,
      password: hash,
      isVerified: false,
      verificationCode: code,
      verificationExpires: expires,
      role: 'user',
      name: '',
    });
    await this.userRepo.save(user);
    sendVerificationEmail(dto.email, code);
    return { message: 'Registro exitoso. Revisa tu correo para el código de verificación.' };
  }

  async verifyEmail(dto: VerifyEmailDto) {
    const user = await this.userRepo.findOne({ where: { email: dto.email } });
    if (!user) throw new NotFoundException('Usuario no encontrado');
    if (user.isVerified) throw new BadRequestException('El correo ya está verificado');
    if (!user.verificationCode || !user.verificationExpires) throw new BadRequestException('No hay código de verificación activo');
    if (user.verificationCode !== dto.code) throw new BadRequestException('Código incorrecto');
    if (user.verificationExpires < new Date()) {
      await this.userRepo.delete(user.id);
      throw new BadRequestException('El código ha expirado. Debes registrarte de nuevo.');
    }
    user.isVerified = true;
    user.verificationCode = null;
    user.verificationExpires = null;
    await this.userRepo.save(user);
    return { message: 'Correo verificado correctamente' };
  }

  async completeProfile(dto: CompleteProfileDto) {
    const user = await this.userRepo.findOne({ where: { email: dto.email } });
    if (!user) throw new NotFoundException('Usuario no encontrado');
    if (!user.isVerified) throw new BadRequestException('Debes verificar tu correo antes de completar el perfil');
    user.documentType = dto.documentType;
    user.document = dto.document;
    user.name = dto.name;
    user.lastname = dto.lastname;
    user.sex = dto.sex;
    user.phone = dto.phone;
    await this.userRepo.save(user);
    return { message: 'Perfil completado correctamente' };
  }

  async login(dto: LoginDto) {
    const user = await this.userRepo.findOne({ where: { email: dto.email } });
    if (!user) throw new UnauthorizedException('Credenciales inválidas');
    if (!user.isVerified) throw new UnauthorizedException('Debes verificar tu correo antes de iniciar sesión');
    const valid = await bcrypt.compare(dto.password, user.password);
    if (!valid) throw new UnauthorizedException('Credenciales inválidas');
    const payload = { sub: user.id, email: user.email, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '1h' });
    return { token, user: { id: user.id, email: user.email, name: user.name, lastname: user.lastname, role: user.role } };
  }

  async refresh(token: string) {
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET!);
      const newToken = jwt.sign({ sub: payload['sub'], email: payload['email'], isAdmin: payload['isAdmin'] }, process.env.JWT_SECRET!, { expiresIn: '1h' });
      return { token: newToken };
    } catch {
      throw new UnauthorizedException('Token inválido');
    }
  }

  async logout(token: string) {
    // En JWT stateless, el logout se maneja en frontend o con blacklist en Redis
    return { message: 'Logout exitoso' };
  }

  // Limpieza automática de usuarios no verificados (llamar desde un cron job)
  async cleanUnverifiedUsers() {
    const now = new Date();
    const users = await this.userRepo.find({ where: { isVerified: false, verificationExpires: LessThan(now) } });
    for (const user of users) {
      await this.userRepo.delete(user.id);
      console.log(`Usuario no verificado eliminado: ${user.email}`);
    }
    return { deleted: users.length };
  }
} 