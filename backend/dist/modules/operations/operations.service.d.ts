import { Repository } from 'typeorm';
import { Operation } from './operation.entity';
export declare class OperationsService {
    private operationsRepository;
    private readonly logger;
    constructor(operationsRepository: Repository<Operation>);
    create(operationData: Partial<Operation>): Promise<Operation>;
    delete(id: number, userId: number): Promise<void>;
    update(id: number, userId: number, updateData: Partial<Operation>): Promise<Operation>;
}
