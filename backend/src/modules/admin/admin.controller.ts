import { Controller, Get, Put, Param, Body } from '@nestjs/common';

@Controller('admin')
export class AdminController {
  @Get('settings')
  async getSettings() {
    // lógica para obtener ajustes
    return { variation: 0.02 };
  }

  @Put('settings')
  async updateSettings(@Body() dto: any) {
    // lógica para actualizar ajustes
    return { message: 'Ajustes actualizados' };
  }

  @Get('orders')
  async getOrders() {
    // lógica para listar órdenes
    return { orders: [] };
  }

  @Put('orders/:id')
  async updateOrder(@Param('id') id: string, @Body() dto: any) {
    // lógica para actualizar estado de orden
    return { message: 'Orden actualizada' };
  }
} 