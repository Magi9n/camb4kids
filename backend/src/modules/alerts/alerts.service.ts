import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
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
    console.log('AlertRepo metadata:', this.alertRepo.metadata);
    console.log('AlertRepo target:', this.alertRepo.target);
    const current = await this.ratesService.getCurrent();
    if (!current.rate) throw new BadRequestException('No se pudo obtener la tasa actual');
    // Validación lógica corregida
    if (dto.type === 'buy' && parseFloat(dto.value as any) >= current.rate) {
      throw new BadRequestException('El valor de compra debe ser menor al precio actual.');
    }
    if (dto.type === 'sell' && parseFloat(dto.value as any) <= current.rate) {
      throw new BadRequestException('El valor de venta debe ser mayor al precio actual.');
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

  async updateAlert(id: number, dto: CreateAlertDto, user: User) {
    const alert = await this.alertRepo.findOne({ 
      where: { id, user: { id: user.id } } 
    });
    
    if (!alert) {
      throw new NotFoundException('Alerta no encontrada');
    }

    const current = await this.ratesService.getCurrent();
    if (!current.rate) throw new BadRequestException('No se pudo obtener la tasa actual');
    
    // Validación lógica corregida
    if (dto.type === 'buy' && parseFloat(dto.value as any) >= current.rate) {
      throw new BadRequestException('El valor de compra debe ser menor al precio actual.');
    }
    if (dto.type === 'sell' && parseFloat(dto.value as any) <= current.rate) {
      throw new BadRequestException('El valor de venta debe ser mayor al precio actual.');
    }

    alert.type = dto.type;
    alert.value = dto.value;
    await this.alertRepo.save(alert);
    
    return { message: 'Alerta actualizada correctamente.' };
  }

  async deleteAlert(id: number, user: User) {
    const alert = await this.alertRepo.findOne({ 
      where: { id, user: { id: user.id } } 
    });
    
    if (!alert) {
      throw new NotFoundException('Alerta no encontrada');
    }

    await this.alertRepo.remove(alert);
    return { message: 'Alerta eliminada correctamente.' };
  }

  async checkAlertsAndNotify() {
    const alerts = await this.alertRepo.find({ where: { triggered: false } });
    if (!alerts.length) return;
    const current = await this.ratesService.getCurrent();
    for (const alert of alerts) {
      if (
        (alert.type === 'buy' && current.rate <= parseFloat(alert.value as any)) ||
        (alert.type === 'sell' && current.rate >= parseFloat(alert.value as any))
      ) {
        // Enviar email
        await this.sendAlertEmail(alert.email, alert.type, alert.value, current.rate);
        alert.triggered = true;
        alert.triggeredAt = new Date();
        await this.alertRepo.save(alert);
      }
    }
  }

  async sendAlertEmail(email: string, type: string, alertValue: number, currentRate: number) {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const subject = type === 'buy' ? '¡Oportunidad de compra!' : '¡Oportunidad de venta!';
    const message = type === 'buy' 
      ? `El dólar ha bajado a S/ ${currentRate.toFixed(3)}. Es momento de comprar.`
      : `El dólar ha subido a S/ ${currentRate.toFixed(3)}. Es momento de vender.`;

    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject,
      text: message,
      html: `<h2>${subject}</h2><p>${message}</p>`,
    });
  }

  async getAlertsForUser(user: User) {
    return this.alertRepo.find({ where: { user: { id: user.id } }, order: { createdAt: 'DESC' } });
  }
} 