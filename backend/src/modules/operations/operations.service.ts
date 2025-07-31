import { Injectable, Logger, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Operation } from './operation.entity';

@Injectable()
export class OperationsService {
  private readonly logger = new Logger(OperationsService.name);
  
  constructor(
    @InjectRepository(Operation)
    private operationsRepository: Repository<Operation>,
  ) {}

  async create(operationData: Partial<Operation>): Promise<Operation> {
    try {
      this.logger.log('Iniciando creación de operación en servicio');
      this.logger.log(`Datos de operación: ${JSON.stringify(operationData)}`);
      
      const operation = this.operationsRepository.create(operationData);
      this.logger.log(`Operación creada con TypeORM: ${JSON.stringify(operation)}`);
      
      const savedOperation = await this.operationsRepository.save(operation);
      this.logger.log(`Operación guardada exitosamente: ${JSON.stringify(savedOperation)}`);
      
      return savedOperation;
    } catch (error) {
      this.logger.error(`Error en servicio al crear operación: ${error.message}`);
      this.logger.error(`Stack trace: ${error.stack}`);
      throw error;
    }
  }

  async delete(id: number, userId: number): Promise<void> {
    try {
      this.logger.log(`Buscando operación ${id} para eliminar`);
      
      const operation = await this.operationsRepository.findOne({
        where: { id, userId }
      });
      
      if (!operation) {
        this.logger.warn(`Operación ${id} no encontrada para usuario ${userId}`);
        throw new NotFoundException('Operación no encontrada');
      }
      
      // Verificar que la operación pertenece al usuario
      if (operation.userId !== userId) {
        this.logger.warn(`Usuario ${userId} intentó eliminar operación ${id} que no le pertenece`);
        throw new ForbiddenException('No tienes permisos para eliminar esta operación');
      }
      
      await this.operationsRepository.remove(operation);
      this.logger.log(`Operación ${id} eliminada exitosamente`);
    } catch (error) {
      this.logger.error(`Error en servicio al eliminar operación ${id}: ${error.message}`);
      this.logger.error(`Stack trace: ${error.stack}`);
      throw error;
    }
  }
} 