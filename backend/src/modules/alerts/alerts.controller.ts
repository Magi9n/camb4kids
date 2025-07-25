import { Controller, Post, Body, UseGuards, Request, Get } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AlertsService } from './alerts.service';
import { CreateAlertDto } from './alert.dto';

@Controller('alerts')
@UseGuards(JwtAuthGuard)
export class AlertsController {
  constructor(private readonly alertsService: AlertsService) {}

  @Post()
  async create(@Body() dto: CreateAlertDto, @Request() req) {
    return this.alertsService.createAlert(dto, req.user);
  }

  @Get()
  async findAll(@Request() req) {
    return this.alertsService.getAlertsForUser(req.user);
  }
} 