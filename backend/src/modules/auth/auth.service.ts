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

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #057c39 0%, #23FFBD 100%); padding: 30px; border-radius: 10px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">MangosCash</h1>
          <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">Verificación de Correo</p>
        </div>
        
        <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <h2 style="color: #333; margin-bottom: 20px;">¡Bienvenido a MangosCash!</h2>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 25px;">
            Gracias por registrarte en nuestra plataforma. Para completar tu registro, 
            necesitamos verificar tu dirección de correo electrónico.
          </p>
          
          <div style="text-align: center; margin: 30px 0; padding: 20px; background: #f8f9fa; border-radius: 8px; border: 2px dashed #057c39;">
            <h3 style="color: #057c39; margin: 0 0 10px 0; font-size: 24px;">Tu código de verificación</h3>
            <div style="font-size: 32px; font-weight: 700; color: #057c39; letter-spacing: 4px; font-family: 'Courier New', monospace;">
              ${code}
            </div>
          </div>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 15px;">
            <strong>Importante:</strong> Este código es válido por 30 minutos. 
            Si no solicitaste este registro, puedes ignorar este correo.
          </p>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 15px;">
            Una vez verificado tu correo, podrás acceder a todas las funcionalidades 
            de nuestra plataforma de cambio de divisas.
          </p>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          
          <p style="color: #999; font-size: 14px; text-align: center;">
            Si tienes problemas con la verificación, contacta nuestro soporte técnico.
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
      subject: 'Verificación de Correo - MangosCash',
      html: htmlContent,
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
    console.log('[DEBUG] login attempt for email:', dto.email);
    
    const user = await this.userRepo.findOne({ where: { email: dto.email } });
    if (!user) {
      console.log('[DEBUG] User not found');
      throw new UnauthorizedException('Credenciales inválidas');
    }
    
    console.log('[DEBUG] User found, checking verification');
    if (!user.isVerified) {
      console.log('[DEBUG] User not verified');
      throw new UnauthorizedException('Debes verificar tu correo antes de iniciar sesión');
    }
    
    console.log('[DEBUG] User verified, comparing passwords');
    const valid = await bcrypt.compare(dto.password, user.password);
    console.log('[DEBUG] Password comparison result:', valid);
    
    if (!valid) {
      console.log('[DEBUG] Password invalid');
      throw new UnauthorizedException('Credenciales inválidas');
    }
    
    console.log('[DEBUG] Login successful, generating token');
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
    console.log('[DEBUG] resetPassword called with token:', dto.token);
    
    const passwordReset = await this.passwordResetRepo.findOne({
      where: { token: dto.token, used: false }
    });

    console.log('[DEBUG] passwordReset found:', passwordReset ? 'YES' : 'NO');

    if (!passwordReset) {
      console.log('[DEBUG] Token not found or already used');
      throw new BadRequestException('Token inválido o ya utilizado');
    }

    if (passwordReset.expiresAt < new Date()) {
      console.log('[DEBUG] Token expired');
      await this.passwordResetRepo.delete(passwordReset.id);
      throw new BadRequestException('El enlace de recuperación ha expirado');
    }

    console.log('[DEBUG] Token valid, looking for user with email:', passwordReset.email);

    // Actualizar contraseña del usuario
    const user = await this.userRepo.findOne({ where: { email: passwordReset.email } });
    if (!user) {
      console.log('[DEBUG] User not found');
      throw new NotFoundException('Usuario no encontrado');
    }

    console.log('[DEBUG] User found, hashing new password');
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    user.password = hashedPassword;
    
    // Marcar al usuario como verificado si no lo estaba
    if (!user.isVerified) {
      console.log('[DEBUG] Marking user as verified');
      user.isVerified = true;
      user.verificationCode = null;
      user.verificationExpires = null;
    }
    
    console.log('[DEBUG] Saving user with new password and verification status');
    await this.userRepo.save(user);
    console.log('[DEBUG] User saved successfully');

    // Marcar token como usado
    passwordReset.used = true;
    await this.passwordResetRepo.save(passwordReset);
    console.log('[DEBUG] Token marked as used');

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
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
    await this.userRepo.delete({
      isVerified: false,
      createdAt: LessThan(thirtyMinutesAgo),
    });
  }

  async getProfileStatus(user: User) {
    // Obtener los datos frescos del usuario desde la base de datos
    const freshUser = await this.userRepo.findOne({ where: { id: user.id } });
    
    if (!freshUser) {
      return {
        isComplete: false,
        missingFields: ['user_not_found'],
      };
    }

    // Verificar si el perfil está completado
    const isProfileComplete = !!(
      freshUser.documentType &&
      freshUser.document &&
      freshUser.sex &&
      freshUser.phone &&
      freshUser.lastname
    );

    return {
      isComplete: isProfileComplete,
      missingFields: isProfileComplete ? [] : this.getMissingFields(freshUser),
    };
  }

  private getMissingFields(user: User): string[] {
    const missingFields = [];
    
    if (!user.documentType) missingFields.push('documentType');
    if (!user.document) missingFields.push('document');
    if (!user.sex) missingFields.push('sex');
    if (!user.phone) missingFields.push('phone');
    if (!user.lastname) missingFields.push('lastname');
    
    return missingFields;
  }
} 