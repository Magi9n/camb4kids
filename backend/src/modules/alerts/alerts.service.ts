import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Alert } from './alert.entity';
import { User } from '../auth/entities/user.entity';
import { CreateAlertDto } from './alert.dto';
import { RatesService } from '../rates/rates.service';
import * as nodemailer from 'nodemailer';

@Injectable()
export class AlertsService {
  constructor(
    @InjectRepository(Alert)
    private readonly alertRepo: Repository<Alert>,
    private readonly ratesService: RatesService,
  ) {}

  async createAlert(dto: CreateAlertDto, user: User) {
    const current = await this.ratesService.getCurrent();
    if (!current.rate) throw new BadRequestException('No se pudo obtener la tasa actual');
    // Validación lógica
    if (dto.type === 'buy' && parseFloat(dto.value as any) <= current.rate) {
      throw new BadRequestException('El valor de compra debe ser mayor al precio actual.');
    }
    if (dto.type === 'sell' && parseFloat(dto.value as any) >= current.rate) {
      throw new BadRequestException('El valor de venta debe ser menor al precio actual.');
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
    if (!alerts.length) return;
    const current = await this.ratesService.getCurrent();
    for (const alert of alerts) {
      if (
        (alert.type === 'buy' && current.rate >= parseFloat(alert.value as any)) ||
        (alert.type === 'sell' && current.rate <= parseFloat(alert.value as any))
      ) {
        // Enviar email
        await this.sendAlertEmail(alert.email, alert.type, alert.value, current.rate);
        alert.triggered = true;
        alert.triggeredAt = new Date();
        await this.alertRepo.save(alert);
      }
    }
  }

  async sendAlertEmail(email: string, type: 'buy' | 'sell', value: number, current: number) {
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
} 