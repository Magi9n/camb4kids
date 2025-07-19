import { Controller, Get, Put, Param, Body, UseGuards } from '@nestjs/common';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';

@UseGuards(RolesGuard)
@Controller('admin')
export class AdminController {
  @Get('settings')
  @Roles('admin')
  async getSettings() {
    // lógica para obtener ajustes
    return { variation: 0.02 };
  }

  @Put('settings')
  @Roles('admin')
  async updateSettings(@Body() dto: any) {
    // lógica para actualizar ajustes
    return { message: 'Ajustes actualizados' };
  }

  @Get('orders')
  @Roles('admin')
  async getOrders() {
    // lógica para listar órdenes
    return { orders: [] };
  }

  @Put('orders/:id')
  @Roles('admin')
  async updateOrder(@Param('id') id: string, @Body() dto: any) {
    // lógica para actualizar estado de orden
    return { message: 'Orden actualizada' };
  }
} 