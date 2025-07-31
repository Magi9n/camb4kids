import { Injectable, Logger } from '@nestjs/common';
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
      this.logger.error(`Error en servicio de operaciones: ${error.message}`);
      this.logger.error(`Stack trace: ${error.stack}`);
      throw error;
    }
  }
} 