import { Controller, Post, Get, Body, Req, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User as UserEntity } from '../auth/entities/user.entity';
import { User } from '../auth/decorators/user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async create(@Body() dto: any, @User() user: UserEntity) {
    // lógica para crear orden
    return { message: 'Orden creada', user };
  }

  @Get()
  async history(@User() user: UserEntity) {
    // lógica para historial
    return { orders: [], user };
  }
} 