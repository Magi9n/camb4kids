"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("./entities/user.entity");
const password_reset_entity_1 = require("./entities/password-reset.entity");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require('nodemailer');
function generateCode() {
    return Math.floor(1000 + Math.random() * 9000).toString();
}
async function sendVerificationEmail(email, code) {
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
    }
    catch (err) {
        console.error('[EMAIL] Error al enviar correo de verificación:', err);
    }
}
let AuthService = class AuthService {
    constructor(userRepo, passwordResetRepo) {
        this.userRepo = userRepo;
        this.passwordResetRepo = passwordResetRepo;
    }
    async register(dto) {
        const exists = await this.userRepo.findOne({ where: { email: dto.email } });
        if (exists)
            throw new common_1.ConflictException('El correo ya está registrado');
        const hash = await bcrypt.hash(dto.password, 10);
        const code = generateCode();
        const expires = new Date(Date.now() + 30 * 60 * 1000);
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
    async verifyEmail(dto) {
        const user = await this.userRepo.findOne({ where: { email: dto.email } });
        if (!user)
            throw new common_1.NotFoundException('Usuario no encontrado');
        if (user.isVerified)
            throw new common_1.BadRequestException('El correo ya está verificado');
        if (!user.verificationCode || !user.verificationExpires)
            throw new common_1.BadRequestException('No hay código de verificación activo');
        if (user.verificationCode !== dto.code)
            throw new common_1.BadRequestException('Código incorrecto');
        if (user.verificationExpires < new Date()) {
            await this.userRepo.delete(user.id);
            throw new common_1.BadRequestException('El código ha expirado. Debes registrarte de nuevo.');
        }
        user.isVerified = true;
        user.verificationCode = null;
        user.verificationExpires = null;
        await this.userRepo.save(user);
        return { message: 'Correo verificado correctamente' };
    }
    async completeProfile(dto) {
        const user = await this.userRepo.findOne({ where: { email: dto.email } });
        if (!user)
            throw new common_1.NotFoundException('Usuario no encontrado');
        if (!user.isVerified)
            throw new common_1.BadRequestException('Debes verificar tu correo antes de completar el perfil');
        user.documentType = dto.documentType;
        user.document = dto.document;
        user.name = dto.name;
        user.lastname = dto.lastname;
        user.sex = dto.sex;
        user.phone = dto.phone;
        await this.userRepo.save(user);
        return { message: 'Perfil completado correctamente' };
    }
    async login(dto) {
        console.log('[DEBUG] login attempt for email:', dto.email);
        const user = await this.userRepo.findOne({ where: { email: dto.email } });
        if (!user) {
            console.log('[DEBUG] User not found');
            throw new common_1.UnauthorizedException('Credenciales inválidas');
        }
        console.log('[DEBUG] User found, checking verification');
        if (!user.isVerified) {
            console.log('[DEBUG] User not verified');
            throw new common_1.UnauthorizedException('Debes verificar tu correo antes de iniciar sesión');
        }
        console.log('[DEBUG] User verified, comparing passwords');
        const valid = await bcrypt.compare(dto.password, user.password);
        console.log('[DEBUG] Password comparison result:', valid);
        if (!valid) {
            console.log('[DEBUG] Password invalid');
            throw new common_1.UnauthorizedException('Credenciales inválidas');
        }
        console.log('[DEBUG] Login successful, generating token');
        const payload = { sub: user.id, email: user.email, role: user.role };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
        return { token, user: { id: user.id, email: user.email, name: user.name, lastname: user.lastname, role: user.role } };
    }
    async refresh(token) {
        try {
            const payload = jwt.verify(token, process.env.JWT_SECRET);
            const newToken = jwt.sign({ sub: payload['sub'], email: payload['email'], isAdmin: payload['isAdmin'] }, process.env.JWT_SECRET, { expiresIn: '1h' });
            return { token: newToken };
        }
        catch (_a) {
            throw new common_1.UnauthorizedException('Token inválido');
        }
    }
    async logout(token) {
        return { message: 'Logout exitoso' };
    }
    async forgotPassword(dto) {
        const user = await this.userRepo.findOne({ where: { email: dto.email } });
        const message = 'Si el correo ingresado existe en nuestra base de datos, recibirás un enlace de recuperación en los próximos minutos.';
        if (!user) {
            return { message };
        }
        const token = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + 30 * 60 * 1000);
        await this.passwordResetRepo.delete({ email: dto.email });
        const passwordReset = this.passwordResetRepo.create({
            email: dto.email,
            token,
            expiresAt,
            used: false,
        });
        await this.passwordResetRepo.save(passwordReset);
        await this.sendPasswordResetEmail(dto.email, token);
        return { message };
    }
    async resetPassword(dto) {
        console.log('[DEBUG] resetPassword called with token:', dto.token);
        const passwordReset = await this.passwordResetRepo.findOne({
            where: { token: dto.token, used: false }
        });
        console.log('[DEBUG] passwordReset found:', passwordReset ? 'YES' : 'NO');
        if (!passwordReset) {
            console.log('[DEBUG] Token not found or already used');
            throw new common_1.BadRequestException('Token inválido o ya utilizado');
        }
        if (passwordReset.expiresAt < new Date()) {
            console.log('[DEBUG] Token expired');
            await this.passwordResetRepo.delete(passwordReset.id);
            throw new common_1.BadRequestException('El enlace de recuperación ha expirado');
        }
        console.log('[DEBUG] Token valid, looking for user with email:', passwordReset.email);
        const user = await this.userRepo.findOne({ where: { email: passwordReset.email } });
        if (!user) {
            console.log('[DEBUG] User not found');
            throw new common_1.NotFoundException('Usuario no encontrado');
        }
        console.log('[DEBUG] User found, hashing new password');
        const hashedPassword = await bcrypt.hash(dto.password, 10);
        user.password = hashedPassword;
        if (!user.isVerified) {
            console.log('[DEBUG] Marking user as verified');
            user.isVerified = true;
            user.verificationCode = null;
            user.verificationExpires = null;
        }
        console.log('[DEBUG] Saving user with new password and verification status');
        await this.userRepo.save(user);
        console.log('[DEBUG] User saved successfully');
        passwordReset.used = true;
        await this.passwordResetRepo.save(passwordReset);
        console.log('[DEBUG] Token marked as used');
        return { message: 'Contraseña actualizada correctamente' };
    }
    async verifyResetToken(token) {
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
    async sendPasswordResetEmail(email, token) {
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
        }
        catch (err) {
            console.error('[EMAIL] Error al enviar correo de recuperación:', err);
        }
    }
    async cleanUnverifiedUsers() {
        const now = new Date();
        const users = await this.userRepo.find({ where: { isVerified: false, verificationExpires: (0, typeorm_2.LessThan)(now) } });
        for (const user of users) {
            await this.userRepo.delete(user.id);
            console.log(`Usuario no verificado eliminado: ${user.email}`);
        }
        return { deleted: users.length };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(password_reset_entity_1.PasswordReset)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], AuthService);
//# sourceMappingURL=auth.service.js.map