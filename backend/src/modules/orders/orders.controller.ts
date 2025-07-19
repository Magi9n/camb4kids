import { Controller, Post, Get, Body, Req, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() dto: any, @Req() req: any) {
    // lógica para crear orden
    return { message: 'Orden creada' };
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async history(@Req() req: any) {
    // lógica para historial
    return { orders: [] };
  }
} 