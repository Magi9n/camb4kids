import { Injectable, UnauthorizedException, ConflictException, BadRequestException, NotFoundException } from '@nestjs/common';
import { RegisterDto, LoginDto, VerifyEmailDto, CompleteProfileDto, ForgotPasswordDto, ResetPasswordDto } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { User } from './entities/user.entity';
import { PasswordReset } from './entities/password-reset.entity';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import * as crypto from 'crypto';
const nodemailer = require('nodemailer');

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
    @InjectRepository(PasswordReset)
    private readonly passwordResetRepo: Repository<PasswordReset>,
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
    await sendVerificationEmail(dto.email, code);
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

  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.userRepo.findOne({ where: { email: dto.email } });
    
    // Siempre devolver el mismo mensaje para evitar enumeración de usuarios
    const message = 'Si el correo ingresado existe en nuestra base de datos, recibirás un enlace de recuperación en los próximos minutos.';
    
    if (!user) {
      return { message };
    }

    // Generar token único
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 minutos

    // Eliminar tokens anteriores para este usuario
    await this.passwordResetRepo.delete({ email: dto.email });

    // Crear nuevo token
    const passwordReset = this.passwordResetRepo.create({
      email: dto.email,
      token,
      expiresAt,
      used: false,
    });

    await this.passwordResetRepo.save(passwordReset);

    // Enviar email
    await this.sendPasswordResetEmail(dto.email, token);

    return { message };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const passwordReset = await this.passwordResetRepo.findOne({
      where: { token: dto.token, used: false }
    });

    if (!passwordReset) {
      throw new BadRequestException('Token inválido o ya utilizado');
    }

    if (passwordReset.expiresAt < new Date()) {
      await this.passwordResetRepo.delete(passwordReset.id);
      throw new BadRequestException('El enlace de recuperación ha expirado');
    }

    // Actualizar contraseña del usuario
    const user = await this.userRepo.findOne({ where: { email: passwordReset.email } });
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    user.password = hashedPassword;
    await this.userRepo.save(user);

    // Marcar token como usado
    passwordReset.used = true;
    await this.passwordResetRepo.save(passwordReset);

    return { message: 'Contraseña actualizada correctamente' };
  }

  async verifyResetToken(token: string) {
    const passwordReset = await this.passwordResetRepo.findOne({
      where: { token, used: false }
    });

    if (!passwordReset) {
      return { valid: false, message: 'Token inválido o ya utilizado' };
    }

    if (passwordReset.expiresAt < new Date()) {
      await this.passwordResetRepo.delete(passwordReset.id);
      return { valid: false, message: 'El enlace de recuperación ha expirado' };
    }

    return { valid: true, email: passwordReset.email };
  }

  private async sendPasswordResetEmail(email: string, token: string) {
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

      const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

      const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #057c39 0%, #23FFBD 100%); padding: 30px; border-radius: 10px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">MangosCash</h1>
            <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">Recuperación de Contraseña</p>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <h2 style="color: #333; margin-bottom: 20px;">Hola,</h2>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 25px;">
              Has solicitado restablecer tu contraseña en MangosCash. 
              Haz clic en el botón de abajo para crear una nueva contraseña.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" 
                 style="background: #057c39; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                Restablecer Contraseña
              </a>
            </div>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 15px;">
              <strong>Importante:</strong> Este enlace es válido por 30 minutos y solo puede ser usado una vez.
            </p>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 15px;">
              Si no solicitaste este cambio, puedes ignorar este correo. Tu contraseña permanecerá sin cambios.
            </p>
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            
            <p style="color: #999; font-size: 14px; text-align: center;">
              Si el botón no funciona, copia y pega este enlace en tu navegador:<br>
              <a href="${resetUrl}" style="color: #057c39;">${resetUrl}</a>
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
            <p>© ${new Date().getFullYear()} MangosCash. Todos los derechos reservados.</p>
          </div>
        </div>
      `;

      await transporter.sendMail({
        from: process.env.SMTP_FROM,
        to: email,
        subject: 'Recuperación de Contraseña - MangosCash',
        html: htmlContent,
      });

      console.log(`[EMAIL] Correo de recuperación enviado a: ${email}`);
    } catch (err) {
      console.error('[EMAIL] Error al enviar correo de recuperación:', err);
    }
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