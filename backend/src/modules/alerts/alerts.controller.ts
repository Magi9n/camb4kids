import { Controller, Post, Body, UseGuards, Request, Get, Delete, Put, Param, ParseIntPipe } from '@nestjs/common';
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

  @Put(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: CreateAlertDto, @Request() req) {
    return this.alertsService.updateAlert(id, dto, req.user);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.alertsService.deleteAlert(id, req.user);
  }
} 