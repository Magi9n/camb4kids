import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Operation } from './operation.entity';

@Injectable()
export class OperationsService {
  constructor(
    @InjectRepository(Operation)
    private operationsRepository: Repository<Operation>,
  ) {}

  async create(operationData: Partial<Operation>): Promise<Operation> {
    const operation = this.operationsRepository.create(operationData);
    return this.operationsRepository.save(operation);
  }
} 