import { Controller, Post, Body, Req, UseGuards, Logger, Delete, Param, ParseIntPipe, Patch } from '@nestjs/common';
import { OperationsService } from './operations.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('operations')
@UseGuards(JwtAuthGuard)
export class OperationsController {
  private readonly logger = new Logger(OperationsController.name);
  
  constructor(private readonly operationsService: OperationsService) {}

  @Post()
  async create(@Body() body: any, @Req() req: any) {
    try {
      this.logger.log('Iniciando creación de operación');
      this.logger.log(`Datos recibidos: ${JSON.stringify(body)}`);
      this.logger.log(`Usuario autenticado: ${JSON.stringify(req.user)}`);
      
      // El usuario autenticado está en req.user
      const user = req.user;
      
      // Mapear los datos del frontend a la estructura de la base de datos
      const operationData = {
        userId: user.id,
        userName: body.nombre || body.userName,
        userDni: body.dni || body.userDni,
        userPhone: body.telefono || body.userPhone,
        amountToSend: body.importe_envia || body.amountToSend,
        exchangeRate: body.tipo_cambio || body.exchangeRate,
        amountToReceive: body.importe_recibe || body.amountToReceive,
        fromCurrency: body.moneda_envia || body.fromCurrency,
        toCurrency: body.moneda_recibe || body.toCurrency,
        fromBank: body.fromBank || '',
        toBank: body.toBank || '',
        fromAccountNumber: body.fromAccountNumber || '',
        toAccountNumber: body.toAccountNumber || '',
        manguitos: body.manguitos || 0,
        status: 'PENDING_TRANSFER',
        transferReference: body.transferReference || null,
        notes: body.notes || null
      };
      
      this.logger.log(`Datos de operación mapeados: ${JSON.stringify(operationData)}`);
      
      const result = await this.operationsService.create(operationData);
      
      this.logger.log(`Operación creada exitosamente: ${JSON.stringify(result)}`);
      return result;
    } catch (error) {
      this.logger.error(`Error al crear operación: ${error.message}`);
      this.logger.error(`Stack trace: ${error.stack}`);
      throw error;
    }
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    try {
      this.logger.log(`Eliminando operación ${id} para usuario ${req.user.id}`);
      
      const result = await this.operationsService.delete(id, req.user.id);
      
      this.logger.log(`Operación ${id} eliminada exitosamente`);
      return result;
    } catch (error) {
      this.logger.error(`Error al eliminar operación ${id}: ${error.message}`);
      this.logger.error(`Stack trace: ${error.stack}`);
      throw error;
    }
  }

  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateData: any, @Req() req: any) {
    try {
      this.logger.log(`Actualizando operación ${id} para usuario ${req.user.id}`);
      this.logger.log(`Datos de actualización: ${JSON.stringify(updateData)}`);
      
      const result = await this.operationsService.update(id, req.user.id, updateData);
      
      this.logger.log(`Operación ${id} actualizada exitosamente`);
      return result;
    } catch (error) {
      this.logger.error(`Error al actualizar operación ${id}: ${error.message}`);
      this.logger.error(`Stack trace: ${error.stack}`);
      throw error;
    }
  }
} 