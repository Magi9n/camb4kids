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
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
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
        await transporter.sendMail({
            from: process.env.SMTP_FROM,
            to: email,
            subject: 'Código de verificación',
            text: `Tu código de verificación es: ${code}\nEste código es válido por 30 minutos.`,
        });
        console.log(`[EMAIL] Correo de verificación enviado a: ${email}`);
    }
    catch (err) {
        console.error('[EMAIL] Error al enviar correo de verificación:', err);
    }
}
let AuthService = class AuthService {
    constructor(userRepo) {
        this.userRepo = userRepo;
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
        const user = await this.userRepo.findOne({ where: { email: dto.email } });
        if (!user)
            throw new common_1.UnauthorizedException('Credenciales inválidas');
        if (!user.isVerified)
            throw new common_1.UnauthorizedException('Debes verificar tu correo antes de iniciar sesión');
        const valid = await bcrypt.compare(dto.password, user.password);
        if (!valid)
            throw new common_1.UnauthorizedException('Credenciales inválidas');
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
    __metadata("design:paramtypes", [typeorm_2.Repository])
], AuthService);
//# sourceMappingURL=auth.service.js.map