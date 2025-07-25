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
exports.AlertsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const alert_entity_1 = require("./alert.entity");
const rates_service_1 = require("../rates/rates.service");
const nodemailer = require("nodemailer");
let AlertsService = class AlertsService {
    constructor(alertRepo, ratesService) {
        this.alertRepo = alertRepo;
        this.ratesService = ratesService;
    }
    async createAlert(dto, user) {
        const current = await this.ratesService.getCurrent();
        if (!current.rate)
            throw new common_1.BadRequestException('No se pudo obtener la tasa actual');
        if (dto.type === 'buy' && parseFloat(dto.value) <= current.rate) {
            throw new common_1.BadRequestException('El valor de compra debe ser mayor al precio actual.');
        }
        if (dto.type === 'sell' && parseFloat(dto.value) >= current.rate) {
            throw new common_1.BadRequestException('El valor de venta debe ser menor al precio actual.');
        }
        const alert = this.alertRepo.create({
            user,
            email: user.email,
            type: dto.type,
            value: dto.value,
            triggered: false,
        });
        await this.alertRepo.save(alert);
        return { message: 'Alerta creada correctamente.' };
    }
    async checkAlertsAndNotify() {
        const alerts = await this.alertRepo.find({ where: { triggered: false } });
        if (!alerts.length)
            return;
        const current = await this.ratesService.getCurrent();
        for (const alert of alerts) {
            if ((alert.type === 'buy' && current.rate >= parseFloat(alert.value)) ||
                (alert.type === 'sell' && current.rate <= parseFloat(alert.value))) {
                await this.sendAlertEmail(alert.email, alert.type, alert.value, current.rate);
                alert.triggered = true;
                alert.triggeredAt = new Date();
                await this.alertRepo.save(alert);
            }
        }
    }
    async sendAlertEmail(email, type, value, current) {
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: parseInt(process.env.SMTP_PORT || '587'),
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
        const subject = '¡Alerta de tipo de cambio activada!';
        const text = `Hola,

Tu alerta de tipo de cambio se ha activado:

${type === 'buy' ? 'Compra' : 'Venta'} llegó a ${current} (tu alerta era ${value})

Te avisaremos si vuelve a ocurrir.

Saludos,
MangosCash`;
        await transporter.sendMail({
            from: process.env.SMTP_FROM,
            to: email,
            subject,
            text,
        });
    }
};
exports.AlertsService = AlertsService;
exports.AlertsService = AlertsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(alert_entity_1.Alert)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        rates_service_1.RatesService])
], AlertsService);
//# sourceMappingURL=alerts.service.js.map