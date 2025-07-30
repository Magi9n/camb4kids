import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Operation } from './operation.entity';

@Injectable()
export class OperationsService {
  constructor(
    @InjectRepository(Operation)
    private operationRepository: Repository<Operation>,
  ) {}

  async create(operationData: Partial<Operation>): Promise<Operation> {
    const operation = this.operationRepository.create(operationData);
    return this.operationRepository.save(operation);
  }

  async findById(id: number): Promise<Operation> {
    return this.operationRepository.findOne({
      where: { id },
      relations: ['user']
    });
  }

  async findByUserId(userId: number): Promise<Operation[]> {
    return this.operationRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' }
    });
  }

  async updateStatus(id: number, status: string, transferReference?: string): Promise<Operation> {
    const updateData: any = { status };
    if (transferReference) {
      updateData.transferReference = transferReference;
    }
    
    await this.operationRepository.update(id, updateData);
    return this.operationRepository.findOne({ where: { id } });
  }

  async findAll(): Promise<Operation[]> {
    return this.operationRepository.find({
      relations: ['user'],
      order: { createdAt: 'DESC' }
    });
  }

  async findByStatus(status: string): Promise<Operation[]> {
    return this.operationRepository.find({
      where: { status },
      relations: ['user'],
      order: { createdAt: 'DESC' }
    });
  }
} 