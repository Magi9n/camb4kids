import { Controller, Post, Body, Req, UseGuards, Logger } from '@nestjs/common';
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
      const operationData = {
        ...body,
        userId: user.id
      };
      
      this.logger.log(`Datos de operación a crear: ${JSON.stringify(operationData)}`);
      
      const result = await this.operationsService.create(operationData);
      
      this.logger.log(`Operación creada exitosamente: ${JSON.stringify(result)}`);
      return result;
    } catch (error) {
      this.logger.error(`Error al crear operación: ${error.message}`);
      this.logger.error(`Stack trace: ${error.stack}`);
      throw error;
    }
  }
} 